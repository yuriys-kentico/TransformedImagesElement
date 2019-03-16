import * as React from "react";
import { ImageCompressionEnum, ImageFormatEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { IFormatTransform } from "../../../types/transformedImage/Transforms";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { SwitchInput } from "../inputs/SwitchInput";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { DropdownInput } from "../inputs/DropdownInput";

export interface IFormatControlsProps extends IBaseControlsProps<IFormatTransform> {
}

export interface IFormatControlsState {
}

export class FormatControls extends BaseControls<IFormatControlsProps, IFormatTransform, IFormatTransform> {
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

    renderControls() {
        const format = this.props.getTransform;

        return (
            <div>
                <div className="fields vertical">
                    <div className="fieldsBlock">
                        <SwitchInput
                            checked={format.autoWebp}
                            onClick={() => this.setTransform({ autoWebp: !format.autoWebp })}
                            label="Auto Webp"
                        />
                        <DropdownInput
                            selected={format.format}
                            setSelected={s => {
                                this.setTransform({ format: s }
                                )
                            }}
                            options={[
                                "Format...",
                                ImageFormatEnum.Gif,
                                ImageFormatEnum.Png,
                                ImageFormatEnum.Png8,
                                ImageFormatEnum.Jpg,
                                ImageFormatEnum.Pjpg,
                                ImageFormatEnum.Webp
                            ]}
                            tooltip="Format"
                        />
                    </div>
                    <div className="fieldsBlock">
                        <SwitchInput
                            checked={format.lossless === ImageCompressionEnum.Lossless}
                            onClick={() => {
                                if (format.lossless !== null) {
                                    switch (format.lossless) {
                                        case ImageCompressionEnum.Lossless:
                                            this.setTransform({ lossless: ImageCompressionEnum.Lossy })
                                            break;
                                        case ImageCompressionEnum.Lossy:
                                            this.setTransform({ lossless: ImageCompressionEnum.Lossless })
                                            break;
                                    }
                                } else {
                                    this.setTransform({ lossless: ImageCompressionEnum.Lossless })
                                }
                            }}
                            label="Lossless"
                        />
                        <NumberInput
                            type={NumberInputType.int}
                            allowedTypes={[NumberInputType.int]}
                            value={format.quality || null}
                            max={100}
                            tooltip="Quality"
                            setValue={value => {
                                this.setTransform({ quality: value })
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}