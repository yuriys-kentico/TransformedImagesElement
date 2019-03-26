import * as React from 'react';
import { fromEvent, Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';

import { Color } from "../../../types/transformedImage/Color";
import { NumberUtils } from '../../../types/NumberUtils';

import { BaseInput, IInputProps, IInputState } from './BaseInput';

export enum ColorInputType {
    hex = "HEX"
}

export interface IColorInputProps<TType, TValue> extends IInputProps<TType, TValue> {
    disableAlpha: boolean;
}

export class ColorInput extends BaseInput<IColorInputProps<ColorInputType, Color>, IInputState<ColorInputType>, ColorInputType, Color> {
    state: IInputState<ColorInputType> = {
        type: null,
        rawValue: "",
        isValid: true
    }

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
            filter(v => {
                return this.props.disableAlpha
                    ? NumberUtils.is3HexNumbers(v)
                    : NumberUtils.is4HexNumbers(v);
            }),
            map(Color.fromHex),
        );
    }

    getValue(value: Color): string {
        if (this.props.disableAlpha) {
            value.rgba = { ...value.rgba, a: 0 };
        }

        return value.toShortHexString();
    }

    renderLabel(): React.ReactNode {
        return (
            <span className="label">
                {this.props.type}
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