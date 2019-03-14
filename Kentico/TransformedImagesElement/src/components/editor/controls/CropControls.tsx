import * as React from "react";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { ResizeType, ICropTransform, CropType } from "../../../types/transformedImage/IImageTransforms";

import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface ICropControlsProps extends IBaseControlsProps<ICropTransform> {
    imageWidth: number;
    imageHeight: number;
}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransform> {
    onClickSidebar(): void {
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

    renderInputs(crop: ICropTransform): React.ReactNode {
        switch (crop.type) {
            case CropType.border:
                return (
                    <div className="fields">
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.widthPercent || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                this.setTransform({ widthPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.heightPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                this.setTransform({ heightPercent: value })
                            }}
                        />
                    </div>
                );
            case CropType.box:
                return (
                    <div className="fields">
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.xPercent || null}
                            max={this.props.imageWidth}
                            tooltip="X"
                            setValue={value => {
                                this.setTransform({ xPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.yPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Y"
                            setValue={value => {
                                this.setTransform({ yPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.widthPercent || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                this.setTransform({ widthPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.heightPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                this.setTransform({ heightPercent: value })
                            }}
                        />
                    </div>
                );
            case CropType.zoom:
                return (
                    <div className="fields">
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.xPercent || null}
                            max={this.props.imageWidth}
                            tooltip="X coordinate"
                            setValue={value => {
                                this.setTransform({ xPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.yPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Y coordinate"
                            setValue={value => {
                                this.setTransform({ yPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.float}
                            value={crop.zoom || null}
                            max={100}
                            min={1}
                            tooltip="Zoom"
                            setValue={value => {
                                this.setTransform({ zoom: value })
                            }}
                        />
                    </div>
                );
        }
    }

    renderControls() {
        const crop = this.props.getTransform;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.border)}`}
                        onClick={() => {
                            this.setTransform({ type: CropType.border })
                        }}
                    >
                        {CropType.border}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.box)}`}
                        onClick={() => {
                            this.setTransform({ type: CropType.box })
                        }}
                    >
                        {CropType.box}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.zoom)}`}
                        onClick={() => {
                            this.setTransform({ type: CropType.zoom })
                        }}
                    >
                        {CropType.zoom}
                    </button>
                </div>
                {this.renderInputs(crop)}

            </div>
        );
    }
}