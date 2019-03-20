import * as React from "react";
import { ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { IFormatTransform, Format } from "../../../types/transformedImage/Transforms";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { SwitchInput } from "../inputs/SwitchInput";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { DropdownInput } from "../inputs/DropdownInput";

export interface IFormatControlsProps extends IBaseControlsProps<IFormatTransform> {
}

export class FormatControls extends BaseControls<IFormatControlsProps, IFormatTransform, IFormatTransform> {
    onClickSidebar(): void {
    }

    //onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
    //    return false;
    //}
    onMouseDown = () => false;

    onMouseMove = () => false;

    onMouseUp = () => false;

    getImageOverlay() {
        return (
            <div>
            </div>
        );
    }

    renderControls() {
        const format = this.props.transform;

        return (
            <div>
                <div className="fields vertical">
                    <div className="fieldsBlock">
                        <DropdownInput
                            selected={format.format || Format.Original}
                            setSelected={s => {
                                this.setTransform({ format: s }
                                )
                            }}
                            options={[
                                Format.Original,
                                Format.Gif,
                                Format.Png,
                                Format.Png8,
                                Format.Jpg,
                                Format.Pjpg,
                                Format.Webp
                            ]}
                            tooltip="Format"
                        />
                        <SwitchInput
                            checked={format.autoWebp}
                            onClick={() => this.setTransform({ autoWebp: !format.autoWebp })}
                            label="Auto Webp"
                        />
                    </div>
                    <div className="fieldsBlock">
                        {
                            format.format === Format.Jpg
                                || format.format === Format.Pjpg
                                || format.format === Format.Webp
                                ? <NumberInput
                                    type={NumberInputType.int}
                                    allowedTypes={[NumberInputType.int]}
                                    value={format.quality || null}
                                    max={100}
                                    tooltip="Quality"
                                    disabled={format.lossless === ImageCompressionEnum.Lossless}
                                    setValue={value => {
                                        this.setTransform({ quality: value })
                                    }}
                                />
                                : null
                        }
                        {
                            format.format === Format.Webp
                                ? <SwitchInput
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
                                : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}