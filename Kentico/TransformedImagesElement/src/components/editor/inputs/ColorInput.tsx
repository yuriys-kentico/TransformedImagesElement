﻿import * as React from 'react';
import { fromEvent, Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';

import { Color } from "../../../types/transformedImage/Color";

import { BaseInput, IInputProps, IInputState } from './BaseInput';

export enum ColorInputType {
    hex = "#"
}

export class ColorInput extends BaseInput<IInputProps<ColorInputType, Color>, IInputState<ColorInputType>, ColorInputType, Color> {
    state: IInputState<ColorInputType> = {
        type: null,
        rawValue: null,
        isValid: true
    }

    private isHexadecimalNumbers = (value: string) => /^([0-9a-fA-F][0-9a-fA-F]){3,4}$|^[0-9a-fA-F]{3,4}$|^$/.test(value);

    componentDidMount() {
        if (this.input) {
            const rawInput = fromEvent<React.FormEvent<HTMLInputElement>>(this.input, "input").pipe(
                map(v => v.currentTarget.value)
            );

            rawInput.pipe(
                rawInput => this.parseRawValue(rawInput)
            ).subscribe(
                v => {
                    this.props.setValue(v);
                    this.setState({ isValid: true });
                });
        }
    }

    private parseRawValue(rawInput: Observable<string>): Observable<Color> {
        return rawInput.pipe(
            filter(v => this.isAllowedCharacters(v, "0-9a-fA-F", 0, 8)),
            map(this.storeValueInState),
            filter(this.isHexadecimalNumbers),
            map(Color.fromHex),
        );
    }

    getValue(value: Color): string {
        return value.isEmpty() ? "" : value.toShortHexString();
    }

    renderLabel(): React.ReactNode {
        return (
            <span>
                #
            </span>
        );
    }

    render() {
        return (
            <span
                className={`input ${this.state.isValid
                    ? ""
                    : "text-field--has-error"}`}
                data-balloon={this.props.tooltip}
                data-balloon-pos="down"
            >
                {this.renderLabel()}
                {this.renderInput()}
            </span>
        );
    }
}