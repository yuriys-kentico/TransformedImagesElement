import * as React from "react";

import { ResizeType, IResizeTransform } from "../../../types/transformedImage/Transforms";
import { FitActions } from "../../../types/editor/resizeActions/FitActions";
import { ScaleActions } from "../../../types/editor/resizeActions/ScaleActions";

import { BaseControls, IBaseControlsProps, EditAction, RectProps } from "./BaseControls";
import { NumberInput } from "../inputs/NumberInput";

export interface IResizeControlsProps extends IBaseControlsProps<IResizeTransform> {
    imageWidth: number;
    imageHeight: number;
}

export interface IResizeControlsState {
}

export class ResizeControls extends BaseControls<IResizeControlsProps, IResizeTransform, IResizeControlsState> {
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
            const { type, scale, fit } = this.props.transform;

            switch (type) {
                case ResizeType.scale:
                    this.setTransform({ scale: new ScaleActions(this.actionParams).getTransform(scale) });
                    break;
                case ResizeType.fit:

                    this.setTransform({ fit: new FitActions(this.actionParams).getTransform(fit) });
                    break;
            }
        }

        this.actionParams.action = EditAction.none;

        return true;
    };

    getImageOverlay() {
        const { type, scale, fit } = this.props.transform;

        let rectProps: RectProps = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        if (this.actionParams.action !== EditAction.none && this.hasMovedMouse()) {
            switch (type) {
                case ResizeType.scale:
                    rectProps = new ScaleActions(this.actionParams).getEditingRect(scale);
                    break;
                case ResizeType.fit:
                    rectProps = new FitActions(this.actionParams).getEditingRect(fit);
                    break;
            }
        } else {
            switch (type) {
                case ResizeType.scale:
                    if (scale.hFloat > 0 && scale.wFloat > 0) {
                        rectProps = new ScaleActions(this.actionParams).getPassiveRect(scale);
                    } else {
                        rectProps = {
                            x: 0,
                            y: 0,
                            width: 100,
                            height: 100
                        };
                    }
                    break;
                case ResizeType.fit:
                    if (fit.hFloat > 0 && fit.wFloat > 0) {
                        rectProps = new FitActions(this.actionParams).getPassiveRect(fit);
                    } else {
                        rectProps = {
                            x: 0,
                            y: 0,
                            width: 100,
                            height: 100
                        };
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

        if (this.actionParams.action !== EditAction.selecting
            && rectProps.width > 0 && rectProps.height > 0
        ) {
            const circle = (id: string, radius: number, cx: string, cy: string) => {
                return <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    id={id}
                    className="grabCircle"
                />
            }

            grabGroup = (
                <g>
                    {circle(EditAction.top, 10, `${rectProps.x + rectProps.width / 2}%`, rectPropsPercent.y)}
                    {circle(EditAction.topRight, 7, `${rectProps.x + rectProps.width}%`, rectPropsPercent.y)}
                    {circle(EditAction.right, 10, `${rectProps.x + rectProps.width}%`, `${rectProps.y + rectProps.height / 2}%`)}
                    {circle(EditAction.bottomRight, 7, `${rectProps.x + rectProps.width}%`, `${rectProps.y + rectProps.height}%`)}
                    {circle(EditAction.bottom, 10, `${rectProps.x + rectProps.width / 2}%`, `${rectProps.y + rectProps.height}%`)}
                    {circle(EditAction.bottomLeft, 7, rectPropsPercent.x, `${rectProps.y + rectProps.height}%`)}
                    {circle(EditAction.left, 10, rectPropsPercent.x, `${rectProps.y + rectProps.height / 2}%`)}
                    {circle(EditAction.topLeft, 7, rectPropsPercent.x, rectPropsPercent.y)}
                </g>
            );
        }

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
                            className="maskRect"
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

    renderInputs(resize: IResizeTransform): React.ReactNode {
        const { type, scale, fit } = resize;

        switch (type) {
            case ResizeType.scale:
                return (
                    <div className="fields" key={ResizeType.scale}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={scale.wFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                resize.scale.wFloat = value;
                                this.setTransform({ scale: resize.scale });
                                this.forceUpdate();
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={scale.hFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                resize.scale.hFloat = value;
                                this.setTransform({ scale: resize.scale })
                            }}
                        />
                    </div>
                );
            case ResizeType.fit:
                return (
                    <div className="fields" key={ResizeType.fit}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={fit.wFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                resize.fit.wFloat = value;
                                this.setTransform({ fit: resize.fit })
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={fit.hFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                resize.fit.hFloat = value;
                                this.setTransform({ fit: resize.fit })
                            }}
                        />
                    </div>
                );
        }
    }

    renderControls() {
        const resize = this.props.transform;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.fit)}`}
                        onClick={() => this.setTransform({ type: ResizeType.fit })}
                    >
                        Fit
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.scale)}`}
                        onClick={() => this.setTransform({ type: ResizeType.scale })}
                    >
                        Scale
                    </button>
                </div>
                {this.renderInputs(resize)}
            </div>
        );
    }
}