import * as React from "react";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { ResizeType, IResizeTransform } from "../../../types/transformedImage/IImageTransforms";

import { NumberInput, NumberInputType } from "../inputs/NumberInput";

export interface IResizeControlsProps extends IBaseControlsProps<IResizeTransform> {
    imageWidth: number;
    imageHeight: number;
}

export class ResizeControls extends BaseControls<IResizeControlsProps, IResizeTransform> {
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

    renderInputs(resize: IResizeTransform): React.ReactNode {
        switch (resize.type) {
            case ResizeType.fit:
            case ResizeType.scale:
                return (
                    <div className="fields">
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={resize.widthPercent || null}
                            setValue={value => this.setTransform({ widthPercent: value })}
                            max={this.props.imageWidth}
                            tooltip="Width"
                        />
                        <NumberInput
                            type={NumberInputType.pixel}
                            value={resize.heightPercent || null}
                            setValue={value => this.setTransform({ heightPercent: value })}
                            max={this.props.imageHeight}
                            tooltip="Height"
                        />
                        <NumberInput
                            type={NumberInputType.float}
                            value={resize.devicePixelRatio || null}
                            setValue={value => this.setTransform({ devicePixelRatio: value })}
                            max={5}
                            tooltip="DPR"
                            disabled={!(resize.heightPercent > 0 || resize.widthPercent > 0)}
                        />
                    </div>
                );
        }
    }

    renderControls() {
        const resize = this.props.getTransform;
        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.fit)}`}
                        onClick={() => {
                            this.setTransform({ type: ResizeType.fit })
                        }}
                    >
                        {ResizeType.fit}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.scale)}`}
                        onClick={() => {
                            this.setTransform({ type: ResizeType.scale })
                        }}
                    >
                        {ResizeType.scale}
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(resize.type === ResizeType.crop)}`}
                        onClick={() => {
                            this.setTransform({ type: ResizeType.crop })
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