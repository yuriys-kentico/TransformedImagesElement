import * as React from "react";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { ResizeType, IResizeTransformation } from "../../../types/transformedImage/IImageTransformations";

import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface IResizeControlsProps extends IBaseControlsProps<IResizeTransformation> {
    imageWidth: number;
    imageHeight: number;
}

export class ResizeControls extends BaseControls<IResizeControlsProps, IResizeTransformation> {
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
        const resize = this.props.getTransformation;
        const hasWidthOrHeight = resize.width > 0 || resize.height > 0;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.fit)}`}
                        disabled={!hasWidthOrHeight}
                        onClick={() => {
                            this.setTransformation({ type: ResizeType.fit })
                        }}
                    >
                        {ResizeType.fit}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.crop)}`}
                        disabled={!(resize.width > 0 && resize.height > 0)}
                        onClick={() => {
                            this.setTransformation({ type: ResizeType.crop })
                        }}
                    >
                        {ResizeType.crop}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.scale)}`}
                        disabled={!hasWidthOrHeight}
                        onClick={() => {
                            this.setTransformation({ type: ResizeType.scale })
                        }}
                    >
                        {ResizeType.scale}
                    </button>
                </div>
                <div className="fields">
                    <NumberInput
                        type={NumberInputType.pixel}
                        value={resize.width || null}
                        max={this.props.imageWidth}
                        tooltip="Width"
                        onChange={value => {
                            this.setTransformation({ width: value })
                        }}
                    />
                    <NumberInput
                        type={NumberInputType.pixel}
                        value={resize.height || null}
                        max={this.props.imageHeight}
                        tooltip="Height"
                        onChange={value => {
                            this.setTransformation({ height: value })
                        }}
                    />
                    <NumberInput
                        type={NumberInputType.float}
                        value={resize.devicePixelRatio || null}
                        visible={resize.height > 0 || resize.width > 0}
                        max={5}
                        tooltip="DPR"
                        onChange={value => {
                            this.setTransformation({ devicePixelRatio: value })
                        }}
                    />
                </div>
            </div>
        );
    }
}