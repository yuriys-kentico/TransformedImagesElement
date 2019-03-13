import * as React from 'react';
import { fromEvent, Observable, of, combineLatest, Subscriber } from "rxjs";
import { map, filter, switchMap, merge, mergeMap } from 'rxjs/operators';
import { number } from 'prop-types';

export enum NumberInputType {
    pixel = "px",
    percent = "%",
    float = ".01",
    hidden = ""
}

export interface INumberInputProps {
    type: NumberInputType;
    value: number;
    setValue(value: number): void;
    max: number;
    min?: number;
    tooltip: string;
}

export interface INumberInputState {
    type?: NumberInputType;
    rawValue: string;
}

export class NumberInput extends React.Component<INumberInputProps, INumberInputState> {
    private input: HTMLInputElement;
    private typeSubject: Subscriber<NumberInputType> = new Subscriber();

    state: INumberInputState = {
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

    private round(value: number, decimals: number): number {
        return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
    }

    private ensureBetween(value: number, max: number, min: number): number {
        return Math.max(Math.min(value, max), min);
    }

    private parseValue(): number | string {
        if (this.state.rawValue !== null) {
            return this.state.rawValue;
        }
        else if (this.props.value !== null) {
            let max = this.props.max;

            switch (this.getType()) {
                case NumberInputType.pixel:
                    return this.round(this.props.value * max, 0);
                case NumberInputType.percent:
                    return this.round(this.props.value * 100, 2);
                case NumberInputType.float:
                    return this.round(this.props.value, 2);
            }
        }
    }

    private parseStream(rawStream: Observable<string>, type: NumberInputType): Observable<number> {
        const min = this.props.min || 0;

        switch (type) {
            case NumberInputType.pixel:
                return rawStream.pipe(
                    map(v => parseInt(v)),
                    map(v => this.ensureBetween(v, this.props.max, min)),
                    map(v => v / this.props.max),
                    map(v => this.round(v, 4))
                );
            case NumberInputType.percent:
                return rawStream.pipe(
                    // Filter digits with a trailing dot or zero
                    filter(v => !/^\d*?\.0?$/.test(v)),
                    map(v => parseFloat(v)),
                    map(v => this.ensureBetween(v, 100, min)),
                    map(v => v / 100),
                    map(v => this.round(v, 4))
                );
            case NumberInputType.float:
                return rawStream.pipe(
                    // Filter digits with a trailing dot or zero
                    filter(v => !/^\d*?\.0?$/.test(v)),
                    map(v => parseFloat(v)),
                    map(v => this.ensureBetween(v, this.props.max, min)),
                    map(v => this.round(v, 2))
                );
        }
    }

    componentDidMount() {
        if (this.input) {
            const onChange = fromEvent<React.FormEvent<HTMLInputElement>>(this.input, "input");

            // Filter digits with an optional dot
            const rawStream = onChange.pipe(
                map(v => v.currentTarget.value),
                filter(v => /^\d*\.?\d{0,2}$/.test(v))
            );

            // Store raw value
            rawStream.subscribe(
                v => this.setState({ rawValue: v })
            );

            new Observable<NumberInputType>(o => {
                this.typeSubject = o;
                this.typeSubject.next(this.getType());
            }).pipe(
                switchMap(t => this.parseStream(rawStream, t))
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

    renderInput(): React.ReactNode {
        return (
            <input
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
        if (this.props.type !== NumberInputType.hidden) {
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
        } else {
            return (
                <span className="input" />
            );
        }
    }
}