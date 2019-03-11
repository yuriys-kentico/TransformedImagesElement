import * as React from "react";
import { CustomPicker, SketchPicker, ColorResult, ColorChangeHandler } from "react-color";

import { Checkerboard } from "../../../types/editor/Checkerboard";
import { OPTIONAL_CONFIG } from "../../Initialize";

export interface IColorInputProps {
    tooltip: string;
    value: ColorResult;
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
                        color={this.props.value.rgb}
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
                onClick={e => e.stopPropagation()}
            >
                {sketchPicker}
                <button
                    className="btn colorBox"
                    onClick={this.props.togglePicker}
                    style={{ background: `rgba(${this.props.value.rgb.r},${this.props.value.rgb.g},${this.props.value.rgb.b},${this.props.value.rgb.a})` }}
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