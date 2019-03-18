import * as React from "react";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { ICropTransform, CropType } from "../../../types/transformedImage/Transforms";

import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { OPTIONAL_CONFIG } from "../../../types/customElement/IElementConfig";

export interface ICropControlsProps extends IBaseControlsProps<ICropTransform> {
    imageWidth: number;
    imageHeight: number;
}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransform> {
    private defaultNumberType = OPTIONAL_CONFIG.inputsDefaultToPercent
        ? NumberInputType.percent
        : NumberInputType.pixel;

    private allowedTypes = [NumberInputType.pixel, NumberInputType.percent];

    onClickSidebar(): void {
    }

    onMouseDown = () => false;

    onMouseMove = () => false;

    onMouseUp = () => false;

    getImageOverlay() {
        return (
            <div>
            </div>
        );
    }

    renderInputs(crop: ICropTransform): React.ReactNode {
        const { type, scale, fit, frame, box, zoom } = crop;

        switch (type) {
            case CropType.scale:
                return (
                    <div className="fields" key={CropType.scale}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedTypes}
                            value={scale.xFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                crop.scale.xFloat = value;
                                this.setTransform({ scale: crop.scale });
                                this.forceUpdate();
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedTypes}
                            value={scale.yFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                crop.scale.yFloat = value;
                                this.setTransform({ scale: crop.scale })
                            }}
                        />
                    </div>
                );
            case CropType.fit:
                return (
                    <div className="fields" key={CropType.fit}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedTypes}
                            value={fit.xFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                crop.fit.xFloat = value;
                                this.setTransform({ fit: crop.fit })
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedTypes}
                            value={fit.yFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                crop.fit.yFloat = value;
                                this.setTransform({ fit: crop.fit })
                            }}
                        />
                    </div>
                );
            case CropType.frame:
                return (
                    <div className="fields" key={CropType.frame}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedTypes}
                            value={frame.xFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                crop.frame.xFloat = value;
                                this.setTransform({ frame: crop.frame })
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedTypes}
                            value={frame.yFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                crop.frame.yFloat = value;
                                this.setTransform({ frame: crop.frame })
                            }}
                        />
                    </div>
                );
            case CropType.box:
                return (
                    <div className="fields vertical" key={CropType.box}>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedTypes}
                                value={box.xFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Start X"
                                setValue={value => {
                                    crop.box.xFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedTypes}
                                value={box.yFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Start Y"
                                setValue={value => {
                                    crop.box.yFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                        </div>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedTypes}
                                value={box.wFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Width"
                                setValue={value => {
                                    crop.box.wFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedTypes}
                                value={box.hFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Height"
                                setValue={value => {
                                    crop.box.hFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                        </div>
                    </div>
                );
            case CropType.zoom:
                return (
                    <div className="fields vertical" key={CropType.zoom}>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedTypes}
                                value={zoom.xFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Center X"
                                setValue={value => {
                                    crop.zoom.xFloat = value;
                                    this.setTransform({ zoom: crop.zoom })
                                }}
                            />
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedTypes}
                                value={zoom.yFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Center Y"
                                setValue={value => {
                                    crop.zoom.yFloat = value;
                                    this.setTransform({ zoom: crop.zoom })
                                }}
                            />
                        </div>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={NumberInputType.float}
                                allowedTypes={[NumberInputType.float]}
                                value={zoom.zFloat || null}
                                max={100}
                                min={1}
                                tooltip="Zoom"
                                setValue={value => {
                                    crop.zoom.zFloat = value;
                                    this.setTransform({ zoom: crop.zoom })
                                }}
                            />
                        </div>
                    </div >
                );
        }
    }

    renderControls() {
        const crop = this.props.transform;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.scale)}`}
                        onClick={() => this.setTransform({ type: CropType.scale })}
                    >
                        Scale
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.fit)}`}
                        onClick={() => this.setTransform({ type: CropType.fit })}
                    >
                        Fit
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.frame)}`}
                        onClick={() => this.setTransform({ type: CropType.frame })}
                    >
                        Frame
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.box)}`}
                        onClick={() => this.setTransform({ type: CropType.box })}
                    >
                        Box
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.zoom)}`}
                        onClick={() => this.setTransform({ type: CropType.zoom })}
                    >
                        Zoom
                    </button>
                </div>
                {this.renderInputs(crop)}
            </div>
        );
    }
}