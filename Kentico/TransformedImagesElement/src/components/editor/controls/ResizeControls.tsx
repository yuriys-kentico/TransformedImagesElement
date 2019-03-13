import * as React from "react";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { ResizeType, IResizeTransformation } from "../../../types/transformedImage/IImageTransformations";

import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface IResizeControlsProps extends IBaseControlsProps<IResizeTransformation> {
    imageWidth: number;
    imageHeight: number;
}

export class ResizeControls extends BaseControls<IResizeControlsProps, IResizeTransformation> {
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

    renderInputs(resize: IResizeTransformation): React.ReactNode {
        switch (resize.type) {
            case ResizeType.fit:
            case ResizeType.scale:
                return (
                    <div className="fields">
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={resize.widthPercent || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                this.setTransformation({ widthPercent: value })
                            }}
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={resize.heightPercent || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                this.setTransformation({ heightPercent: value })
                            }}
                        />
                        <NumberInput
                            type={resize.heightPercent > 0 || resize.widthPercent > 0
                                ? NumberInputType.float
                                : NumberInputType.hidden
                            }
                            value={resize.devicePixelRatio || null}
                            max={5}
                            tooltip="DPR"
                            setValue={value => {
                                this.setTransformation({ devicePixelRatio: value })
                            }}
                        />
                    </div>
                );
        }
    }

    renderControls() {
        const resize = this.props.getTransformation;
        const hasWidthOrHeight = resize.widthPercent > 0 || resize.heightPercent > 0;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.fit)}`}
                        onClick={() => {
                            this.setTransformation({ type: ResizeType.fit })
                        }}
                    >
                        {ResizeType.fit}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.scale)}`}
                        onClick={() => {
                            this.setTransformation({ type: ResizeType.scale })
                        }}
                    >
                        {ResizeType.scale}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.crop)}`}
                        onClick={() => {
                            this.setTransformation({ type: ResizeType.crop })
                        }}
                    >
                        {ResizeType.crop}
                    </button>

                </div>
                {this.renderInputs(resize)}
            </div>
        );
    }
}