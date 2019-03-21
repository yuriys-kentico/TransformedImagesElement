import * as React from "react";

import { ICropTransform, CropType } from "../../../types/transformedImage/Transforms";
import { BoxActions } from "../../../types/editor/cropActions/boxActions";
import { ZoomActions } from "../../../types/editor/cropActions/ZoomActions";
import { FrameActions } from "../../../types/editor/cropActions/FrameActions";

import { BaseControls, IBaseControlsProps, EditAction, RectProps } from "./BaseControls";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface ICropControlsProps extends IBaseControlsProps<ICropTransform> {
    imageWidth: number;
    imageHeight: number;
}

export interface ICropControlsState {
}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransform, ICropControlsState> {
    onClickSidebar(): void {
    }

    onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const mouseXY = this.getMouseXY(event);

        this.actionParams = {
            startXFloat: mouseXY.x,
            startYFloat: mouseXY.y,
            endXFloat: mouseXY.x,
            endYFloat: mouseXY.y,
            action: EditAction.selecting,
        };

        if (event.target instanceof SVGCircleElement) {
            this.actionParams.action = event.target.id;
        }

        return true;
    };

    onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.actionParams.action !== EditAction.none) {
            const mouseXY = this.getMouseXY(event);

            this.actionParams.endXFloat = mouseXY.x;
            this.actionParams.endYFloat = mouseXY.y;

            return true;
        }

        return false;
    };

    onMouseUp = () => {
        if (this.actionParams.action !== EditAction.none) {
            const { type } = this.props.transform;

            switch (type) {
                case CropType.frame:
                    this.setTransform({ frame: new FrameActions(this.actionParams).getTransform() });
                    break;
                case CropType.box:
                    this.setTransform({ box: new BoxActions(this.actionParams).getTransform() });
                    break;
                case CropType.zoom:
                    this.setTransform({ zoom: new ZoomActions(this.actionParams).getTransform() });
                    break;
            }
        }

        this.actionParams.action = EditAction.none;

        return true;
    };

    getImageOverlay() {
        const { type, frame, box, zoom } = this.props.transform;

        let rectProps: RectProps = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        if (this.actionParams.action !== EditAction.none && this.hasMovedMouse()) {
            switch (type) {
                case CropType.frame:
                    rectProps = new FrameActions(this.actionParams).getEditingRect();
                    break;
                case CropType.box:
                    rectProps = new BoxActions(this.actionParams).getEditingRect();
                    break;
                case CropType.zoom:
                    rectProps = new ZoomActions(this.actionParams).getEditingRect();
            }
        } else {
            switch (type) {
                case CropType.frame:
                    rectProps = new FrameActions(this.actionParams).getPassiveRect(frame);
                    break;
                case CropType.box:
                    rectProps = new BoxActions(this.actionParams).getPassiveRect(box);
                    break;
                case CropType.zoom:
                    if (zoom.zFloat > 0) {
                        rectProps = new ZoomActions(this.actionParams).getPassiveRect(zoom);
                    }
                    break;
            }
        }

        const rectPropsPercent = {
            x: `${rectProps.x}%`,
            y: `${rectProps.y}%`,
            width: `${rectProps.width}%`,
            height: `${rectProps.height}%`
        }

        let grabGroup: JSX.Element = <g />;

        return (
            <svg>
                <defs>
                    <mask id="boxMask">
                        <rect
                            width="100%"
                            height="100%"
                            fill="white"
                        />
                        <rect
                            {...rectPropsPercent}
                        />
                    </mask>
                </defs>
                <rect
                    {...rectPropsPercent}
                    className="selectRect"
                />
                <rect
                    width="100%"
                    height="100%"
                    mask="url(#boxMask)"
                    className="outsideRect"
                />
                {grabGroup}
            </svg>
        );
    }

    renderInputs(crop: ICropTransform): React.ReactNode {
        const { type, frame, box, zoom } = crop;

        switch (type) {
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
            case CropType.frame:
                return (
                    <div className="fields" key={CropType.frame}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={frame.wFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                crop.frame.wFloat = value;
                                this.setTransform({ frame: crop.frame })
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={frame.hFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                crop.frame.hFloat = value;
                                this.setTransform({ frame: crop.frame })
                            }}
                        />
                    </div>
                );
        }
    }

    renderControls() {
        const crop = this.props.transform;

        return (
            <div>
                <div className="modes">
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
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.frame)}`}
                        onClick={() => this.setTransform({ type: CropType.frame })}
                    >
                        Frame
                    </button>
                </div>
                {this.renderInputs(crop)}
            </div>
        );
    }
}