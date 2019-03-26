import * as React from "react";

import { ResizeType, IResizeTransform } from "../../../types/transformedImage/Transforms";
import { FitActions } from "../../../types/editor/resizeActions/FitActions";
import { ScaleActions } from "../../../types/editor/resizeActions/ScaleActions";

import { BaseControls, IBaseControlsProps, EditAction, RectProps } from "./BaseControls";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { SVGOverlay } from "./SVGOverlay";

export interface IResizeControlsProps extends IBaseControlsProps<IResizeTransform> {
}

export interface IResizeControlsState {
}

export class ResizeControls extends BaseControls<IResizeControlsProps, IResizeTransform, IResizeControlsState> {
    onClickSidebar(): void {
    }

    updateTransform = () => {
        if (this.actionParams.action !== EditAction.none) {
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

        if (this.actionParams.action !== EditAction.none) {
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

        if (rectProps.height === 0 && rectProps.width === 0) {
            rectProps = this.noRectProps;
        }

        this.currentRectProps = rectProps;

        return (
            <SVGOverlay
                rectProps={rectProps}
                canDrag={false}
                isSelecting={this.actionParams.action === EditAction.selecting}
            />
        );
    }

    renderInputs(resize: IResizeTransform): React.ReactNode {
        const { type, scale, fit } = resize;

        if (this.props.imageHeight && this.props.imageWidth) {
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
                            <NumberInput
                                type={NumberInputType.float}
                                allowedTypes={[NumberInputType.float]}
                                value={this.getZeroOrNull(resize.devicePixelRatio)}
                                max={5}
                                min={0}
                                tooltip="Device Pixel Ratio"
                                disabled={resize.scale.hFloat === 0 && resize.scale.wFloat === 0}
                                setValue={value => {
                                    this.setTransform({ devicePixelRatio: value })
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
                            <NumberInput
                                type={NumberInputType.float}
                                allowedTypes={[NumberInputType.float]}
                                value={this.getZeroOrNull(resize.devicePixelRatio)}
                                max={5}
                                min={0}
                                tooltip="Device Pixel Ratio"
                                disabled={resize.fit.hFloat === 0 && resize.fit.wFloat === 0}
                                setValue={value => {
                                    this.setTransform({ devicePixelRatio: value })
                                }}
                            />
                        </div>
                    );
            }
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