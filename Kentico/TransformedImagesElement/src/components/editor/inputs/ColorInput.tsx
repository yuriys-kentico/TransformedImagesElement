import * as React from 'react';
import { fromEvent, Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';

import { IInputState, IInputProps } from './NumberInput';
import { Color } from '../controls/BackgroundControls';
import { TransformedImage } from '../../../types/transformedImage/TransformedImage';

export enum ColorInputType {
    hex = "#"
}

export class ColorInput extends React.Component<IInputProps<ColorInputType, Color>, IInputState<ColorInputType>> {
    private input: HTMLInputElement;

    state: IInputState<ColorInputType> = {
        type: null,
        rawValue: null
    }

    private isHexadecimalCharacters = (value: string) => /^[0-9a-fA-F]{3,8}$/.test(value);

    private isHexadecimalNumbers = (value: string) => /^([0-9a-fA-F][0-9a-fA-F]){3,4}$|^[0-9a-fA-F]{3,4}$/.test(value);

    private storeValueInState = (value: string) => { this.setState({ rawValue: value }); return value; };

    private toColor = (value: string) => {
        let a = 0;
        let r = 0;
        let g = 0;
        let b = 0;

        if (value.length === 8) {
            a = Number(`0x${value.slice(0, 2)}`);
        }

        if (value.length >= 6) {
            r = Number(`0x${value.slice(0, 2)}`);
            g = Number(`0x${value.slice(2, 4)}`);
            b = Number(`0x${value.slice(4, 6)}`);
        }

        if (value.length === 4) {
            a = Number(`0x${value.slice(0, 1)}${value.slice(0, 1)}`);
        }

        if (value.length >= 3) {
            r = Number(`0x${value.slice(0, 1)}${value.slice(0, 1)}`);
            g = Number(`0x${value.slice(1, 2)}${value.slice(1, 2)}`);
            b = Number(`0x${value.slice(2, 3)}${value.slice(2, 3)}`);
        }

        a = Math.round(a / 255);

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
                    this.setState({ rawValue: null });
                });

            //const onKeydown = fromEvent<React.KeyboardEvent<HTMLInputElement>>(this.input, "keydown");

            //onKeydown.subscribe(
            //    k => console.log(k.which)
            //);
        }
    }

    private parseRawValue(rawInput: Observable<string>): Observable<Color> {
        return rawInput.pipe(
            filter(this.isHexadecimalCharacters),
            map(this.storeValueInState),
            filter(this.isHexadecimalNumbers),
            map(this.toColor)
        );
    }

    private parseValue(): string {
        if (this.state.rawValue !== null) {
            return this.state.rawValue;
        }
        else if (this.props.value !== null) {
            return TransformedImage.getBackgroundColor(this.props.value);
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
        return (
            <span>
                #
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
                {this.renderLabel()}
                {this.renderInput()}
            </span>
        );
    }
}