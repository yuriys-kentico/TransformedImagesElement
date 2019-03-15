import * as React from 'react';
import { fromEvent, Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';

import { Color } from '../controls/BackgroundControls';
import { TransformedImage } from '../../../types/transformedImage/TransformedImage';
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

    private doubleCharacter = (c: string) => c + c;

    private toColor = (value: string) => {
        if (value.length === 3) {
            value = `0${value}`;
        }

        if (value.length === 4) {
            value = [...value].map(this.doubleCharacter).join("");
        }

        if (value.length === 6) {
            value = `00${value}`;
        }

        let a = Number(`0x${value.slice(0, 2)}`) || 0;
        const r = Number(`0x${value.slice(2, 4)}`) || 0;
        const g = Number(`0x${value.slice(4, 6)}`) || 0;
        const b = Number(`0x${value.slice(6, 8)}`) || 0;

        a = this.toRounded(a / 255, 4);

        return {
            argb: { a, r, g, b }
        };
    };

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
            map(this.toColor),
        );
    }

    getValue(value: Color): string {
        return TransformedImage.getBackgroundColor(value);
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