import * as React from "react";
import { CustomPicker, SketchPicker, ColorResult, ColorChangeHandler } from "react-color";

import { Checkerboard } from "../../../types/editor/Checkerboard";

export interface IColorInputProps {
    tooltip: string;
    value: ColorResult;
    setValue: ColorChangeHandler;
}

export interface IColorPickerState {
    pickerOpen: boolean;
}

class ColorPicker extends React.Component<IColorInputProps, IColorPickerState> {
    state: IColorPickerState = {
        pickerOpen: false
    }

    render() {
        const sketchPicker = this.state.pickerOpen
            ? (
                <div className="picker">
                    <SketchPicker
                        color={this.props.value.rgb}
                        onChange={this.props.setValue}
                        presetColors={["#D0021B", "#F5A623", "#F8E71C", "#7ED321", "#417505",
                            "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2", "#B8E986", "#000000",
                            "#4A4A4A", "#9B9B9B", "#FFFFFF"]}
                    />
                </div>
            )
            : null;

        return (
            <span className="input" data-balloon={this.props.tooltip} data-balloon-pos="down">
                {sketchPicker}
                <button
                    className="btn colorBox"
                    onClick={() => this.setState(state => { return { pickerOpen: !state.pickerOpen } })}
                    style={{ background: `rgba(${this.props.value.rgb.r},${this.props.value.rgb.g},${this.props.value.rgb.b},${this.props.value.rgb.a}) url(${Checkerboard.getCheckerBoard("transparent", "rgba(0,0,0,.08)", 8)}) center left` }}
                />
            </span>
        );
    }
};

export default CustomPicker(ColorPicker);