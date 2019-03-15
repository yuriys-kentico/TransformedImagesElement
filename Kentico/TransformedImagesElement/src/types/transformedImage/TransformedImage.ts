import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";
import { ImageFitModeEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { TransformedImageModel } from "./TransformedImageModel";
import { IImageTransforms, CropType } from "./IImageTransforms";

import { Color } from '../../components/editor/controls/BackgroundControls';

export class TransformedImage extends AssetModels.Asset {
    private imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";
    private baseImageUrl: string;

    transforms: IImageTransforms = {
        crop: {
            type: CropType.scale,
            scale: {
                xFloat: null,
                yFloat: null
            },
            fit: {
                xFloat: null,
                yFloat: null
            },
            frame: {
                xFloat: null,
                yFloat: null
            },
            box: {
                xFloat: null,
                yFloat: null,
                wFloat: null,
                hFloat: null
            },
            zoom: {
                xFloat: null,
                yFloat: null,
                zFloat: null
            },
            resize: {
                xFloat: null,
                yFloat: null,
            },
            devicePixelRatio: null
        },
        background: {
            color: null,
        },
        format: {
            format: null,
            lossless: null,
            quality: null,
            autoWebp: null,
        }
    };

    constructor(
        projectId: string,
        image?: AssetModels.Asset,
        model?: TransformedImageModel
    ) {
        super(image);

        this.baseImageUrl = `${this.imageEndpoint}/${projectId}/${image.fileReference.id}/${image.fileName}`;

        if (model && model.transforms) {
            this.transforms = model.transforms;
        }
    }

    private static toRounded = (value: number, decimals: number = 0) => Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);

    static assetIsImage(asset: AssetModels.Asset): boolean {
        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
        ];

        return asset.imageWidth !== null
            && allowedImageTypes.indexOf(asset.type) > -1;
    }

    static getBackgroundColor(color: Color): string {
        const { a, r, g, b } = color.argb;

        if (a === 0 && r === 0 && g === 0 && b === 0) {
            return null;
        }

        let aHex: string;
        let rHex: string;
        let gHex: string;
        let bHex: string;

        const a255 = this.toRounded(a * 255);

        if ((a255 || 0) % 17 === 0
            && (r || 0) % 17 === 0
            && (g || 0) % 17 === 0
            && (b || 0) % 17 === 0) {
            aHex = (a255 / 17).toString(16);
            rHex = (r / 17).toString(16);
            gHex = (g / 17).toString(16);
            bHex = (b / 17).toString(16);
        } else {
            aHex = a255.toString(16).padStart(2, "0");
            rHex = r.toString(16).padStart(2, "0");
            gHex = g.toString(16).padStart(2, "0");
            bHex = b.toString(16).padStart(2, "0");
        }

        if ((a || 0) === 0) {
            aHex = "";
        }

        return `${aHex}${rHex}${gHex}${bHex}`;
    }

    buildUrl(): ImageUrlBuilder {
        return new ImageUrlBuilder(this.baseImageUrl);
    }

    buildEditedUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();
        const { crop, background } = this.transforms;

        switch (crop.type) {
            case CropType.scale:
                if (crop.scale.xFloat > 0
                    && crop.scale.yFloat > 0) {
                    builder
                        .withFitMode(ImageFitModeEnum.Scale)
                        .withWidth(crop.scale.xFloat)
                        .withHeight(crop.scale.yFloat);
                }
                break;
            case CropType.fit:
                if (crop.fit.xFloat > 0
                    && crop.fit.yFloat > 0) {
                    builder
                        .withFitMode(ImageFitModeEnum.Clip)
                        .withWidth(crop.fit.xFloat)
                        .withHeight(crop.fit.yFloat);
                }
                break;
            case CropType.frame:
                if (crop.frame.xFloat > 0
                    && crop.frame.yFloat > 0) {
                    // Fit=crop does not work with floats
                    builder
                        .withRectangleCrop(.5, .5, crop.frame.xFloat, crop.frame.yFloat);
                }
                break;
            case CropType.box:
                if (crop.box.xFloat > 0
                    && crop.box.yFloat > 0
                    && crop.box.wFloat > 0
                    && crop.box.hFloat > 0) {
                    builder
                        .withRectangleCrop(crop.box.xFloat, crop.box.yFloat, crop.box.wFloat, crop.box.hFloat);
                }
                break;
            case CropType.zoom:
                if (crop.zoom.xFloat > 0
                    && crop.zoom.yFloat > 0
                    && crop.zoom.zFloat > 0) {
                    builder
                        .withFocalPointCrop(crop.zoom.xFloat, crop.zoom.yFloat, crop.zoom.zFloat);
                }
                break;
        }

        switch (crop.type) {
            case CropType.frame:
            case CropType.box:
                if (crop.resize.xFloat > 0) {
                    builder
                        .withWidth(crop.resize.xFloat);
                }
                if (crop.resize.yFloat > 0) {
                    builder
                        .withHeight(crop.resize.yFloat);
                }
                break;
            case CropType.zoom:
                if (crop.resize.xFloat > 0
                    && crop.resize.yFloat > 0) {
                    builder
                        .withWidth(crop.resize.xFloat)
                        .withHeight(crop.resize.yFloat);
                }
                break;
        }

        switch (crop.type) {
            case CropType.frame:
            case CropType.box:
            case CropType.zoom:
                if (crop.resize.xFloat > 0
                    && crop.resize.yFloat > 0) {
                    builder
                        .withDpr(crop.devicePixelRatio);
                }
                break;
        }

        if (background.color) {
            builder.withCustomParam("bg", TransformedImage.getBackgroundColor(background.color));
        }

        return builder;
    }

    buildHoverUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();

        return builder
            .withWidth(1000)
            .withHeight(1000);;
    }

    getDeliveryModel(): FieldModels.AssetModel {
        return new TransformedImageModel(
            this.fileName,
            this.type,
            this.size,
            this.descriptions[0].description,
            this.buildEditedUrl().getUrl(),
            this.id,
            this.transforms
        );
    }
};