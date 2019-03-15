import * as React from 'react';
import { fromEvent, Observable, Subscriber } from "rxjs";
import { map, filter, switchMap } from 'rxjs/operators';

import { BaseInput, IInputState, IInputProps } from './BaseInput';

export enum NumberInputType {
    pixel = "px",
    percent = "%",
    float = ".01"
}

export interface INumberInputProps<TType, TValue> extends IInputProps<TType, TValue> {
    allowedTypes: NumberInputType[];
    max: TValue;
    min?: TValue;
}

export class NumberInput extends BaseInput<INumberInputProps<NumberInputType, number>, IInputState<NumberInputType>, NumberInputType, number> {
    private typeSubject: Subscriber<NumberInputType> = new Subscriber();

    state: IInputState<NumberInputType> = {
        type: null,
        rawValue: null,
        isValid: true,
    }

    private getType = () => this.state.type || this.props.type;

    private switchType(type: NumberInputType): void {
        const allowedTypes = this.props.allowedTypes;
        const allowedTypesLength = allowedTypes.length;
        const currentTypeIndex = allowedTypes.indexOf(type);

        const newType = allowedTypes[(currentTypeIndex + 1) % allowedTypesLength];

        this.typeSubject.next(newType);
        this.setState({
            type: newType,
            rawValue: null
        });
    }

    private isDigitsOptionallyDotAndDecimals = (value: string, decimals: number) => new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`).test(value);

    private isDigitsWithATrailingDotOrZero = (value: string) => !/^\d*?\.0?$/.test(value);

    private toNumber = (value: string) => parseFloat(value);

    private toBetween = (value: number, max: number, min: number) => Math.max(Math.min(value, max), min);

    private ensureBetween = (value: string, max: number, min: number): string => {
        const tempValue = this.toNumber(value);

        if (tempValue !== NaN && (tempValue > max || tempValue < min)) {
            return this.toBetween(tempValue, max, min).toString();
        }

        return value;
    };

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
                    this.setState({ isValid: true });
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
                    filter(v => this.isAllowedCharacters(v, "0-9", 0)),
                    map(v => this.ensureBetween(v, this.props.max, min)),
                    map(this.storeValueInState),
                    map(this.toNumber),
                    map(v => this.toBetween(v, this.props.max, min)),
                    map(v => v / this.props.max),
                    map(v => this.toRounded(v, 4))
                )

            case NumberInputType.percent:
                return rawInput.pipe(
                    filter(v => this.isDigitsOptionallyDotAndDecimals(v, 2)),
                    map(v => this.ensureBetween(v, 100, min)),
                    map(this.storeValueInState),
                    filter(this.isDigitsWithATrailingDotOrZero),
                    map(this.toNumber),
                    map(v => v / 100),
                    map(v => this.toRounded(v, 4))
                )

            case NumberInputType.float:
                return rawInput.pipe(
                    filter(v => this.isDigitsOptionallyDotAndDecimals(v, 2)),
                    map(v => this.ensureBetween(v, this.props.max, min)),
                    map(this.storeValueInState),
                    filter(this.isDigitsWithATrailingDotOrZero),
                    map(this.toNumber),
                    map(v => this.toRounded(v, 2))
                )
        }
    }

    getValue(value: number): string {
        let max = this.props.max;

        switch (this.getType()) {
            case NumberInputType.pixel:
                return this.toRounded(value * max, 0).toString();
            case NumberInputType.percent:
                return (value * 100).toString();
            case NumberInputType.float:
                return value.toString();
        }
    }

    renderLabel(): React.ReactNode {
        const type = this.getType();

        let title;
        let onClick;

        switch (type) {
            case NumberInputType.pixel:
            case NumberInputType.percent:
                title = "Toggle between pixels and %";
                onClick = () => this.switchType(type);
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
}