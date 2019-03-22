import * as React from "react";
import { ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { IFormatTransform, Format } from "../../../types/transformedImage/Transforms";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { SwitchInput } from "../inputs/SwitchInput";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { DropdownInput } from "../inputs/DropdownInput";
import { If } from "../../If";

export interface IFormatControlsProps extends IBaseControlsProps<IFormatTransform> {
}

export class FormatControls extends BaseControls<IFormatControlsProps, IFormatTransform, IFormatTransform> {
    onClickSidebar(): void {
    }

    updateTransform = () => false;

    getImageOverlay() {
        return (
            <div>
            </div>
        );
    }

    onClickLossless = () => {
        const format = this.props.transform;
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
    };

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
                        <If shouldRender={format.format === Format.Jpg
                            || format.format === Format.Pjpg
                            || format.format === Format.Webp}>
                            <NumberInput
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
                        </If>
                        <If shouldRender={format.format === Format.Webp}>
                            <SwitchInput
                                checked={format.lossless === ImageCompressionEnum.Lossless}
                                onClick={this.onClickLossless}
                                label="Lossless"
                            />
                        </If>
                    </div>
                </div>
            </div>
        );
    }
}