import * as React from "react";
import { CustomPicker, SketchPicker, ColorChangeHandler } from "react-color";

import { Checkerboard } from "../../../types/editor/Checkerboard";
import { OPTIONAL_CONFIG } from "../../../types/customElement/IElementConfig";
import { Color } from "../../../types/transformedImage/Color";

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
                        color={this.props.value.rgba.a === 0
                            ? this.props.value.toRgb()
                            : this.props.value.toPickerFormat()}
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
                    style={{
                        background: this.props.value.toCssRgba()
                    }}
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