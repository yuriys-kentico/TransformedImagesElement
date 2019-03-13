import * as React from "react";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { ResizeType, ICropTransformation, CropType } from "../../../types/transformedImage/IImageTransformations";

import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface ICropControlsProps extends IBaseControlsProps<ICropTransformation> {
    imageWidth: number;
    imageHeight: number;
}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransformation> {
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

    renderInputs(crop: ICropTransformation): React.ReactNode {
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
                                this.setTransformation({ widthPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.heightPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                this.setTransformation({ heightPercent: value })
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
                                this.setTransformation({ xPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.yPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Y"
                            setValue={value => {
                                this.setTransformation({ yPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.widthPercent || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                this.setTransformation({ widthPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.heightPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                this.setTransformation({ heightPercent: value })
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
                                this.setTransformation({ xPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={crop.yPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Y coordinate"
                            setValue={value => {
                                this.setTransformation({ yPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.float}
                            value={crop.zoom || null}
                            max={100}
                            min={1}
                            tooltip="Zoom"
                            setValue={value => {
                                this.setTransformation({ zoom: value })
                            }}
                        />
                    </div>
                );
        }
    }

    renderControls() {
        const crop = this.props.getTransformation;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.border)}`}
                        onClick={() => {
                            this.setTransformation({ type: CropType.border })
                        }}
                    >
                        {CropType.border}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.box)}`}
                        onClick={() => {
                            this.setTransformation({ type: CropType.box })
                        }}
                    >
                        {CropType.box}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.zoom)}`}
                        onClick={() => {
                            this.setTransformation({ type: CropType.zoom })
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