import * as React from "react";
import { CustomPicker, SketchPicker, ColorChangeHandler } from "react-color";

import { Checkerboard } from "../../../types/editor/Checkerboard";
import { OPTIONAL_CONFIG } from "../../Initialize";

import { Color } from '../controls/BackgroundControls';

export interface IColorInputProps {
    tooltip: string;
    value: Color;
    setValue: ColorChangeHandler;
}

export interface IColorPickerProps extends IColorInputProps {
    isPickerOpen: boolean;
    togglePicker(): void;
}

class ColorPicker extends React.Component<IColorPickerProps> {
    render() {
        const sketchPicker = this.props.isPickerOpen
            ? (
                <div className="picker">
                    <SketchPicker
                        color={this.props.value.argb}
                        onChange={this.props.setValue}
                        presetColors={OPTIONAL_CONFIG.colorPickerDefaultColors}
                    />
                </div>
            )
            : null;

        return (
            <span
                className="input"
                data-balloon={this.props.tooltip}
                data-balloon-pos="down"
                onClick={e => this.props.isPickerOpen ? e.stopPropagation() : null}
            >
                {sketchPicker}
                <button
                    className="btn colorBox"
                    onClick={this.props.togglePicker}
                    style={{ background: `rgba(${this.props.value.argb.r},${this.props.value.argb.g},${this.props.value.argb.b},${this.props.value.argb.a})` }}
                />
                <div
                    className="colorBoxBackground"
                    style={{ background: `url(${Checkerboard.generate("transparent", "rgba(0,0,0,.08)", 8)}) center left` }}
                />
            </span>
        );
    }
};

export default CustomPicker(ColorPicker);