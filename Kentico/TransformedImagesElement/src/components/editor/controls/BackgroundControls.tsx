import * as React from "react";
import { ColorResult } from "react-color";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { IBackgroundTransformation } from "../../../types/transformedImage/IImageTransformations";

import ColorPicker from "../inputs/ColorPicker";
import HexInput from "../inputs/HexInput";
import AlphaInput from "../inputs/AlphaInput";

export interface IBackgroundControlsProps extends IBaseControlsProps<IBackgroundTransformation> {
}

export class BackgroundControls extends BaseControls<IBackgroundControlsProps, IBackgroundTransformation> {
    private emptyColor: ColorResult = {
        hex: "#000000",
        hsl: { a: 0, h: 0, s: 0, l: 0 },
        rgb: { a: 0, r: 0, g: 0, b: 0 }
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
                        setValue={(value: ColorResult) => {
                            this.setTransformation({ color: value })
                        }}
                    />
                    <AlphaInput
                        value={background.color || this.emptyColor}
                        tooltip="Transparency"
                        setValue={(value: ColorResult) => {
                            this.setTransformation({ color: value })
                        }}
                    />
                    <ColorPicker
                        value={background.color || this.emptyColor}
                        tooltip="Pick a color"
                        setValue={(value: ColorResult) => {
                            this.setTransformation({ color: value })
                        }}
                    />
                </div>
            </div>
        );
    }
}