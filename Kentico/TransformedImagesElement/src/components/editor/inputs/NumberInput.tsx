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

    private getType = () => this.state.type || this.props.type;

    private typeSubject: Subject<NumberInputType> = new BehaviorSubject(this.getType());

    private switchType(type: NumberInputType): void {
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

            this.typeSubject.pipe(
                switchMap(t => this.parseRawValue(rawInput, t))
            ).subscribe(
                v => {
                    this.props.setValue(v);
                    this.setState({ isValid: true });
                });

            //const onKeydown = fromEvent<React.KeyboardEvent<HTMLInputElement>>(this.input, "keydown");

            // 38 = up, 40 = down

            //this.typeSubject.pipe(
            //    switchMap(t => {
            //        switch (t) {
            //            case NumberInputType.int:
            //            case NumberInputType.pixel:
            //                return onKeydown.pipe(
            //                    map(k => {
            //                        if (k.keyCode === 38) {
            //                            return 1;
            //                        }
            //                        if (k.keyCode === 40) {
            //                            return -1;
            //                        }
            //                    }))
            //            case NumberInputType.percent:
            //            case NumberInputType.float:
            //                return onKeydown.pipe(
            //                    map(k => {
            //                        if (k.keyCode === 38) {
            //                            return .01;
            //                        }
            //                        if (k.keyCode === 40) {
            //                            return -.01;
            //                        }
            //                    }))
            //        }
            //        return from([0]);
            //    })
            //).subscribe(
            //    (k: number) => {
            //        if (this.props.value !== null) {
            //            this.props.setValue(this.props.value + k);
            //        }
            //    }
            //);
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
                    map(v => NumberUtils.toBetween(v, this.props.max, min)),
                    map(v => NumberUtils.toRounded(v, 4))
                )

            case NumberInputType.pixel:
                return rawInput.pipe(
                    filter(v => this.isAllowedCharacters(v, "0-9", 0)),
                    map(v => NumberUtils.ensureBetween(v, this.props.max, min)),
                    map(this.storeValueInState),
                    map(NumberUtils.toNumber),
                    map(v => NumberUtils.toBetween(v, this.props.max, min)),
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

        switch (this.getType()) {
            case NumberInputType.int:
                return NumberUtils.toRounded(value, 0).toString();
            case NumberInputType.pixel:
                return NumberUtils.toRounded(value * max, 0).toString();
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
                className="label"
                title={title}
                onClick={onClick}
            >
                {type}
            </span>
        );
    }
}