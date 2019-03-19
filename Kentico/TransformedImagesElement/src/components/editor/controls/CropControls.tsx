import * as React from "react";

import { ICropTransform, CropType } from "../../../types/transformedImage/Transforms";
import { OPTIONAL_CONFIG } from "../../../types/customElement/IElementConfig";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { NumberUtils } from "../../../types/NumberUtils";

export interface ICropControlsProps extends IBaseControlsProps<ICropTransform> {
    imageWidth: number;
    imageHeight: number;
}

export interface ICropControlsState {
}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransform, ICropControlsState> {
    private defaultNumberType = OPTIONAL_CONFIG.inputsDefaultToPercent
        ? NumberInputType.percent
        : NumberInputType.pixel;

    private allowedNumberTypes = [NumberInputType.pixel, NumberInputType.percent];

    selecting = false;

    startXFloat = 0;
    startYFloat = 0;
    endXFloat = 0;
    endYFloat = 0;

    onClickSidebar(): void {
    }

    onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const mouseXY = this.getMouseXY(event);

        this.startXFloat = mouseXY.x;
        this.endXFloat = mouseXY.x;
        this.startYFloat = mouseXY.y;
        this.endYFloat = mouseXY.y;

        this.selecting = true;

        return true;
    };

    onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.selecting) {
            const mouseXY = this.getMouseXY(event);

            this.endXFloat = mouseXY.x;
            this.endYFloat = mouseXY.y;

            return true;
        }

        return false;
    };

    onMouseUp = () => {
        if (this.selecting) {
            const { type, scale, fit, frame, box, zoom } = this.props.transform;

            switch (type) {
                case CropType.scale:
                case CropType.fit:
                case CropType.frame:
                    break;
                case CropType.box:
                    const XFloat = this.startXFloat > this.endXFloat
                        ? this.endXFloat
                        : this.startXFloat;

                    const YFloat = this.startYFloat > this.endYFloat
                        ? this.endYFloat
                        : this.startYFloat;

                    const WFloat = NumberUtils.toRounded(Math.abs(this.endXFloat - this.startXFloat), 2);
                    const HFloat = NumberUtils.toRounded(Math.abs(this.endYFloat - this.startYFloat), 2);

                    box.xFloat = XFloat;
                    box.yFloat = YFloat;
                    box.wFloat = WFloat;
                    box.hFloat = HFloat;

                    this.setTransform({ box: box });
                    break;
                case CropType.zoom:
                    break;
            }
        }
        this.selecting = false;

        return true;
    };

    getImageOverlay() {
        const { type, scale, fit, frame, box, zoom } = this.props.transform;

        let selectionRect: JSX.Element = <rect />;

        switch (type) {
            case CropType.scale:
            case CropType.fit:
            case CropType.frame:
                break;
            case CropType.box:
                const XFloat = this.startXFloat > this.endXFloat
                    ? this.endXFloat
                    : this.startXFloat;

                const YFloat = this.startYFloat > this.endYFloat
                    ? this.endYFloat
                    : this.startYFloat;

                const WFloat = NumberUtils.toRounded(Math.abs(this.endXFloat - this.startXFloat), 2);
                const HFloat = NumberUtils.toRounded(Math.abs(this.endYFloat - this.startYFloat), 2);

                selectionRect = this.selecting
                    ? <rect
                        x={`${XFloat * 100}%`}
                        y={`${YFloat * 100}%`}
                        width={`${WFloat * 100}%`}
                        height={`${HFloat * 100}%`}
                        fill="black"
                    />
                    : <rect
                        x={`${box.xFloat * 100}%`}
                        y={`${box.yFloat * 100}%`}
                        width={`${box.wFloat * 100}%`}
                        height={`${box.hFloat * 100}%`}
                        fill="black"
                    />;
                break;
            case CropType.zoom:
                break;
        }

        return (
            <svg>
                <defs>
                    <mask id="boxMask">
                        <rect width="100%" height="100%" fill="white" />
                        {selectionRect}
                    </mask>
                </defs>
                <rect width="100%" height="100%" fill="#000a" mask="url(#boxMask)" />
            </svg>
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
                            allowedTypes={this.allowedNumberTypes}
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
                            allowedTypes={this.allowedNumberTypes}
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
                            allowedTypes={this.allowedNumberTypes}
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
                            allowedTypes={this.allowedNumberTypes}
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
                            allowedTypes={this.allowedNumberTypes}
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
                            allowedTypes={this.allowedNumberTypes}
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
                                allowedTypes={this.allowedNumberTypes}
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
                                allowedTypes={this.allowedNumberTypes}
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
                                allowedTypes={this.allowedNumberTypes}
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
                                allowedTypes={this.allowedNumberTypes}
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
                                allowedTypes={this.allowedNumberTypes}
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
                                allowedTypes={this.allowedNumberTypes}
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