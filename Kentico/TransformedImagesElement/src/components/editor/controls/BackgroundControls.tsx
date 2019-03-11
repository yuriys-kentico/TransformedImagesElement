import * as React from "react";
import { ColorResult } from "react-color";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { IBackgroundTransformation } from "../../../types/transformedImage/IImageTransformations";

import ColorPicker from "../inputs/ColorPicker";
import HexInput from "../inputs/HexInput";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface IBackgroundControlsProps extends IBaseControlsProps<IBackgroundTransformation> {
}

export interface IBackgroundControlsState {
    pickerOpen: boolean;
}

export class BackgroundControls extends BaseControls<IBackgroundControlsProps, IBackgroundTransformation, IBackgroundControlsState> {
    private emptyColor: ColorResult = {
        hex: "#000000",
        hsl: { a: 0, h: 0, s: 0, l: 0 },
        rgb: { a: 0, r: 0, g: 0, b: 0 }
    }

    state: IBackgroundControlsState = {
        pickerOpen: false
    }

    onClickSidebar(): void {
        if (this.state.pickerOpen) {
            this.setState({ pickerOpen: false });
        }
    }

    onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
        return false;
    }

    onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
        return false;
    }

    onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
        return false;
    }

    getImageOverlay() {
        return (
            <div>
            </div>
        );
    }

    renderControls() {
        const background = this.props.getTransformation;

        return (
            <div>
                <div className="fields">
                    <HexInput
                        value={background.color || this.emptyColor}
                        tooltip="Hex color"
                        setValue={value => {
                            this.setTransformation({ color: value })
                        }}
                    />
                    <NumberInput
                        type={NumberInputType.float}
                        value={background.color
                            ? background.color.rgb.a
                            : this.emptyColor.rgb.a}
                        max={1}
                        tooltip="Transparency"
                        setValue={value => {
                            const backgroundColor = this.props.getTransformation.color
                                ? this.props.getTransformation.color
                                : this.emptyColor;
                            backgroundColor.rgb.a = value;
                            this.setTransformation({ color: backgroundColor })
                        }}
                    />
                    <ColorPicker
                        isPickerOpen={this.state.pickerOpen}
                        togglePicker={() => this.setState(state => {
                            return {
                                pickerOpen: !state.pickerOpen
                            }
                        })}
                        value={background.color || this.emptyColor}
                        tooltip="Pick a color"
                        setValue={value => {
                            this.setTransformation({ color: value })
                        }}
                    />
                </div>
            </div>
        );
    }
}