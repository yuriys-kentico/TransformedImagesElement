import * as React from "react";

import { BaseControls, IBaseControlsProps } from "../../../types/editor/BaseControls";
import { ResizeType, IResizeTransformation } from "../../../types/transformedImage/IImageTransformations";

import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface IResizeControlsProps extends IResizeTransformation, IBaseControlsProps {
    imageWidth: number;
    imageHeight: number;
    setResizeType(type: ResizeType): void;
    setResizeHeight(height: number): void;
    setResizeWidth(height: number): void;
    setResizeDpr(height: number): void;
}

export class ResizeControls extends BaseControls<IResizeControlsProps> {
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

    render() {
        const hasWidthOrHeight = this.props.width > 0 || this.props.height > 0;

        return (
            <div
                className={`control ${this.getCurrentClass()}`}
                onClick={() => this.props.setCurrentEditor(this)}
            >
                <div className="modes">
                    <button
                        className={`btn mode ${this.getButtonClassForTransformationType(hasWidthOrHeight && !(this.props.type === ResizeType.crop || this.props.type === ResizeType.scale))}`}
                        disabled={!hasWidthOrHeight}
                        onClick={() => this.props.setResizeType(ResizeType.fit)}
                    >
                        {ResizeType.fit}
                    </button>
                    <button
                        className={`btn mode ${this.getButtonClassForTransformationType(this.props.width > 0 && this.props.height > 0 && this.props.type === ResizeType.crop)}`}
                        disabled={!(this.props.width > 0 && this.props.height > 0)}
                        onClick={() => this.props.setResizeType(ResizeType.crop)}
                    >
                        {ResizeType.crop}
                    </button>
                    <button
                        className={`btn mode ${this.getButtonClassForTransformationType(hasWidthOrHeight && this.props.type === ResizeType.scale)}`}
                        disabled={!hasWidthOrHeight}
                        onClick={() => this.props.setResizeType(ResizeType.scale)}
                    >
                        {ResizeType.scale}
                    </button>
                </div>
                <div className="fields">
                    <NumberInput
                        type={NumberInputType.pixel}
                        value={this.props.width || ""}
                        max={this.props.imageWidth}
                        tooltip="Width"
                        onChange={value => this.props.setResizeWidth(parseFloat(value))}
                    />
                    <NumberInput
                        type={NumberInputType.pixel}
                        value={this.props.height || ""}
                        max={this.props.imageHeight}
                        tooltip="Height"
                        onChange={value => this.props.setResizeHeight(parseFloat(value))}
                    />
                    <NumberInput
                        type={NumberInputType.float}
                        value={this.props.devicePixelRatio || ""}
                        visible={this.props.height > 0 || this.props.width > 0}
                        max={5}
                        tooltip="DPR"
                        onChange={value => this.props.setResizeDpr(parseFloat(value))}
                    />
                </div>
            </div>
        );
    }
}