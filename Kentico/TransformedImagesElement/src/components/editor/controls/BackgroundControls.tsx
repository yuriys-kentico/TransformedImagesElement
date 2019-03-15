import * as React from "react";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { IBackgroundTransform } from "../../../types/transformedImage/IImageTransforms";

import ColorPicker from "../inputs/ColorPicker";
import { ColorInput, ColorInputType } from "../inputs/ColorInput";

export interface IBackgroundControlsProps extends IBaseControlsProps<IBackgroundTransform> {
}

export interface IBackgroundControlsState {
    pickerOpen: boolean;
}

export interface Color {
    argb: { a?: number, r: number, g: number, b: number }
}

export class BackgroundControls extends BaseControls<IBackgroundControlsProps, IBackgroundTransform, IBackgroundControlsState> {
    private emptyColor: Color = {
        argb: { a: 1, r: 0, g: 0, b: 0 }
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
        const background = this.props.getTransform;

        return (
            <div>
                <div className="fields">
                    <ColorInput
                        type={ColorInputType.hex}
                        value={background.color || this.emptyColor}
                        tooltip="Hex color"
                        isLabelFirst={true}
                        setValue={value => {
                            this.setTransform({ color: value })
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
                            this.setTransform({
                                color: { argb: Object.assign({}, value.rgb) }
                            })
                        }}
                    />
                </div>
            </div>
        );
    }
}