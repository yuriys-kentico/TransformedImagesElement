import * as React from 'react';
import { fromEvent, Observable, Subject, BehaviorSubject } from "rxjs";
import { map, filter, switchMap } from 'rxjs/operators';

import { NumberUtils } from '../../../types/NumberUtils';

import { BaseInput, IInputState, IInputProps } from './BaseInput';

export enum NumberInputType {
    float = "#.##",
    int = "###",
    pixel = "px",
    percent = "%"
}

export interface INumberInputProps<TType, TValue> extends IInputProps<TType, TValue> {
    allowedTypes: NumberInputType[];
    max: TValue;
    min?: TValue;
}

export class NumberInput extends BaseInput<INumberInputProps<NumberInputType, number>, IInputState<NumberInputType>, NumberInputType, number> {
    state: IInputState<NumberInputType> = {
        type: null,
        rawValue: "",
        isValid: true,
    }

    //private UPKEY = 38;
    //private DOWNKEY = 40;

    //private inputKeyCodes = [
    //    this.UPKEY,
    //    this.DOWNKEY
    //];

    private get type() {
        return this.state.type || this.props.type;
    }

    private typeSubject: Subject<NumberInputType> = new BehaviorSubject(this.type);

    private switchType(type: NumberInputType) {
        const allowedTypes = this.props.allowedTypes;
        const allowedTypesLength = allowedTypes.length;
        const currentTypeIndex = allowedTypes.indexOf(type);

        const newType = allowedTypes[(currentTypeIndex + 1) % allowedTypesLength];

        this.typeSubject.next(newType);
        this.setState({
            type: newType,
            rawValue: ""
        });
    }

    componentDidMount() {
        if (this.input) {
            const rawInput = fromEvent<React.FormEvent<HTMLInputElement>>(this.input, "input").pipe(
                map(v => v.currentTarget.value)
            );

            //const pressedKey = fromEvent<React.KeyboardEvent<HTMLInputElement>>(this.input, "keydown").pipe(
            //    map(k => k.keyCode),
            //    filter(k => this.inputKeyCodes.indexOf(k) > -1)
            //);

            this.typeSubject.pipe(
                switchMap(t => this.parseRawValue(rawInput, t))
            ).subscribe(
                v => {
                    this.props.setValue(v);
                    this.setState({ isValid: true });
                });
        }
    }
    private parseRawValue(rawInput: Observable<string>, type: NumberInputType): Observable<number> {
        const min = this.props.min || 0;

        switch (type) {
            case NumberInputType.int:
                return rawInput.pipe(
                    filter(v => this.isAllowedCharacters(v, "0-9", 0)),
                    map(v => NumberUtils.ensureBetween(v, this.props.max, min)),
                    map(this.storeValueInState),
                    map(NumberUtils.toNumber),
                    map(v => NumberUtils.toRounded(v, 4))
                )

            case NumberInputType.pixel:
                return rawInput.pipe(
                    filter(v => this.isAllowedCharacters(v, "0-9", 0)),
                    map(v => NumberUtils.ensureBetween(v, this.props.max, min)),
                    map(this.storeValueInState),
                    map(NumberUtils.toNumber),
                    map(v => v / this.props.max),
                    map(v => NumberUtils.toRounded(v, 4))
                )

            case NumberInputType.percent:
                return rawInput.pipe(
                    filter(v => NumberUtils.isDigitsOptionallyDotAndDecimals(v, 2)),
                    map(v => NumberUtils.ensureBetween(v, 100, min)),
                    map(this.storeValueInState),
                    filter(NumberUtils.isDigitsWithATrailingDotOrZero),
                    map(NumberUtils.toNumber),
                    map(v => v / 100),
                    map(v => NumberUtils.toRounded(v, 4))
                )

            case NumberInputType.float:
                return rawInput.pipe(
                    filter(v => NumberUtils.isDigitsOptionallyDotAndDecimals(v, 2)),
                    map(v => NumberUtils.ensureBetween(v, this.props.max, min)),
                    map(this.storeValueInState),
                    filter(NumberUtils.isDigitsWithATrailingDotOrZero),
                    map(NumberUtils.toNumber),
                    map(v => NumberUtils.toRounded(v, 2))
                )
        }
    }

    getValue(value: number): string {
        let max = this.props.max;

        switch (this.type) {
            case NumberInputType.int:
                return NumberUtils.toRounded(value, 0).toString();
            case NumberInputType.pixel:
                return NumberUtils.toRounded(value * max, 0).toString();
            case NumberInputType.percent:
                return NumberUtils.toRounded(value * 100, 2).toString();
            case NumberInputType.float:
                return NumberUtils.toRounded(value, 2).toString();
        }
    }

    renderLabel(): React.ReactNode {
        const type = this.type;

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
                className="label"
                title={title}
                onClick={onClick}
            >
                {type}
            </span>
        );
    }
}