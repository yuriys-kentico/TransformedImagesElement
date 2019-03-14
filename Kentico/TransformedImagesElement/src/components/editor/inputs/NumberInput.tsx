import * as React from 'react';
import { fromEvent, Observable, Subscriber } from "rxjs";
import { map, filter, switchMap } from 'rxjs/operators';

export enum NumberInputType {
    pixel = "px",
    percent = "%",
    float = ".01"
}

export interface INumberInputProps<TType, TValue> extends IInputProps<TType, TValue> {
    max: TValue;
    min?: TValue;
}

export interface IInputProps<TType, TValue> {
    type: TType;
    value: TValue;
    setValue(value: TValue): void;
    tooltip: string;
    disabled?: boolean;
}

export interface IInputState<TType> {
    type?: TType;
    rawValue: string;
}

export class NumberInput extends React.Component<INumberInputProps<NumberInputType, number>, IInputState<NumberInputType>> {
    private input: HTMLInputElement;
    private typeSubject: Subscriber<NumberInputType> = new Subscriber();

    state: IInputState<NumberInputType> = {
        type: null,
        rawValue: null
    }

    private getType = () => this.state.type || this.props.type;

    private toggleType(type: NumberInputType): void {
        let newType: NumberInputType;

        switch (type) {
            case NumberInputType.pixel:
                newType = NumberInputType.percent;
                break;
            case NumberInputType.percent:
                newType = NumberInputType.pixel;
                break;
        }

        this.typeSubject.next(newType);
        this.setState({ type: newType });
    }

    private isDigitsOnly = (value: string) => /^\d*$/.test(value);

    private isDigitsOptionallyDotAndDecimals = (value: string, decimals: number) => new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`).test(value);

    private isDigitsWithATrailingDotOrZero = (value: string) => !/^\d*?\.0?$/.test(value);

    private storeValueInState = (value: string) => { this.setState({ rawValue: value }); return value; };

    private toNumber = (value: string) => parseFloat(value);

    private toBetween = (value: number, max: number, min: number) => Math.max(Math.min(value, max), min);

    private toRounded = (value: number, decimals: number) => Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);

    componentDidMount() {
        if (this.input) {
            const rawInput = fromEvent<React.FormEvent<HTMLInputElement>>(this.input, "input").pipe(
                map(v => v.currentTarget.value)
            );

            new Observable<NumberInputType>(o => {
                this.typeSubject = o;
                this.typeSubject.next(this.getType());
            }).pipe(
                switchMap(t => this.parseRawValue(rawInput, t))
            ).subscribe(
                v => {
                    this.props.setValue(v);
                    this.setState({ rawValue: null });
                });

            //const onKeydown = fromEvent<React.KeyboardEvent<HTMLInputElement>>(this.input, "keydown");

            //onKeydown.subscribe(
            //    k => console.log(k.which)
            //);
        }
    }

    private parseRawValue(rawInput: Observable<string>, type: NumberInputType): Observable<number> {
        const min = this.props.min || 0;

        switch (type) {
            case NumberInputType.pixel:
                return rawInput.pipe(
                    filter(this.isDigitsOnly),
                    map(this.storeValueInState),
                    map(this.toNumber),
                    map(v => this.toBetween(v, this.props.max, min)),
                    map(v => v / this.props.max),
                    map(v => this.toRounded(v, 4))
                )

            case NumberInputType.percent:
                return rawInput.pipe(
                    filter(v => this.isDigitsOptionallyDotAndDecimals(v, 2)),
                    map(this.storeValueInState),
                    filter(this.isDigitsWithATrailingDotOrZero),
                    map(this.toNumber),
                    map(v => this.toBetween(v, 100, min)),
                    map(v => v / 100),
                    map(v => this.toRounded(v, 4))
                )

            case NumberInputType.float:
                return rawInput.pipe(
                    filter(v => this.isDigitsOptionallyDotAndDecimals(v, 2)),
                    map(this.storeValueInState),
                    filter(this.isDigitsWithATrailingDotOrZero),
                    map(this.toNumber),
                    map(v => this.toBetween(v, this.props.max, min)),
                    map(v => this.toRounded(v, 2))
                )
        }
    }

    private parseValue(): number | string {
        if (this.state.rawValue !== null) {
            return this.state.rawValue;
        }
        else if (this.props.value !== null) {
            let max = this.props.max;

            switch (this.getType()) {
                case NumberInputType.pixel:
                    return this.toRounded(this.props.value * max, 0);
                case NumberInputType.percent:
                    return this.props.value * 100;
                case NumberInputType.float:
                    return this.props.value;
            }
        }
    }

    renderInput(): React.ReactNode {
        return (
            <input
                disabled={this.props.disabled}
                className="text-field__input"
                ref={e => this.input = e}
                value={this.parseValue()}
                onChange={() => null}
            />
        );
    }

    renderLabel(): React.ReactNode {
        const type = this.getType();

        let title;
        let onClick;

        switch (type) {
            case NumberInputType.pixel:
            case NumberInputType.percent:
                title = "Toggle between pixels and %";
                onClick = () => this.toggleType(type);
        }

        return (
            <span
                title={title}
                onClick={onClick}
            >
                {type}
            </span>
        );
    }

    render() {
        return (
            <span
                className={`input ${this.state.rawValue !== null
                    ? "text-field--has-error"
                    : ""}`}
                data-balloon={this.props.tooltip}
                data-balloon-pos="down"
            >
                {this.renderInput()}
                {this.renderLabel()}
            </span>
        );
    }
}