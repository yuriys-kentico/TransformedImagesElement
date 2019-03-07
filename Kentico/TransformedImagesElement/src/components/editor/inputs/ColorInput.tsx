import * as React from "react";
import { Color } from "csstype";

export interface IColorInputProps {
    visible?: boolean;
    value: Color;
    tooltip: string;
    onChange(value: Color): void;
}

export class ColorInput extends React.Component<IColorInputProps, {}> {
    render() {
        const hidden = this.props.visible === undefined ? false : !this.props.visible;

        return (
            <span className="input" data-balloon={this.props.tooltip} data-balloon-pos="down">
                <input
                    type="color"
                    value={this.props.value}
                    onChange={e => this.props.onChange(e.target.value)}
                    hidden={hidden}
                />
            </span>
        );
    }
}