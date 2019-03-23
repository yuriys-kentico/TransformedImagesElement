import * as React from "react";

import { ResizeType, IResizeTransform } from "../../../types/transformedImage/Transforms";
import { FitActions } from "../../../types/editor/resizeActions/FitActions";
import { ScaleActions } from "../../../types/editor/resizeActions/ScaleActions";

import { BaseControls, IBaseControlsProps, EditAction, RectProps, RectPropsPercent } from "./BaseControls";
import { NumberInput } from "../inputs/NumberInput";
import { If } from "../../If";

export interface IResizeControlsProps extends IBaseControlsProps<IResizeTransform> {
}

export interface IResizeControlsState {
}

export class ResizeControls extends BaseControls<IResizeControlsProps, IResizeTransform, IResizeControlsState> {
    onClickSidebar(): void {
    }

    updateTransform = () => {
        if (this.actionParams.action !== EditAction.none) {
            if (!this.mouseHasMoved()) {
                this.currentRectProps = {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
            }

            const { type } = this.props.transform;

            switch (type) {
                case ResizeType.scale:
                    this.setTransform({ scale: new ScaleActions().getTransform(this.currentRectProps) });
                    break;
                case ResizeType.fit:
                    this.setTransform({ fit: new FitActions().getTransform(this.currentRectProps) });
                    break;
            }

            this.actionParams.action = EditAction.none;
        }

        return true;
    };

    getImageOverlay() {
        const { type, scale, fit } = this.props.transform;

        let rectProps: RectProps = { ...this.noRectProps };

        if (this.actionParams.action !== EditAction.none && this.mouseHasMoved()) {
            switch (type) {
                case ResizeType.scale:
                    rectProps = new ScaleActions().getEditingRect(this.actionParams, scale);
                    break;
                case ResizeType.fit:
                    rectProps = new FitActions().getEditingRect(this.actionParams, fit);
                    break;
            }
        } else {
            switch (type) {
                case ResizeType.scale:
                    if (scale.hFloat > 0 && scale.wFloat > 0) {
                        rectProps = new ScaleActions().getPassiveRect(scale);
                    } else {
                        rectProps = this.noRectProps;
                    }
                    break;
                case ResizeType.fit:
                    if (fit.hFloat > 0 && fit.wFloat > 0) {
                        rectProps = new FitActions().getPassiveRect(fit);
                    } else {
                        rectProps = this.noRectProps;
                    }
                    break;
            }
        }

        rectProps = this.ensureRectWithinImage(rectProps);

        const rectPropsPercent: RectPropsPercent = {
            x: `${rectProps.x * 100}%`,
            y: `${rectProps.y * 100}%`,
            width: `${rectProps.width * 100}%`,
            height: `${rectProps.height * 100}%`
        }

        this.currentRectProps = rectProps;

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
                    id="imageMaskRect"
                    width="100%"
                    height="100%"
                    mask="url(#boxMask)"
                    className="outsideRect"
                />
                <If shouldRender={this.actionParams.action !== EditAction.selecting
                    && rectProps.width > 0 && rectProps.height > 0}>
                    {this.getGrabCirclesGroup(rectProps)}
                </If>
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
                            value={this.getZeroOrNull(scale.wFloat)}
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
                            value={this.getZeroOrNull(scale.hFloat)}
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
                            value={this.getZeroOrNull(fit.wFloat)}
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
                            value={this.getZeroOrNull(fit.hFloat)}
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