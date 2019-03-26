import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";
import { ImageFitModeEnum, ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { TransformedImageModel } from "./TransformedImageModel";
import { ITransforms, CropType, Transforms, Format, ResizeType } from "./Transforms";
import { NumberUtils } from "../NumberUtils";
import { OPTIONAL_CONFIG } from "../customElement/IElementConfig";
import { Color } from "./Color";

export class TransformedImage extends AssetModels.Asset {
    private imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";
    private baseImageUrl: string;

    transforms: ITransforms;
    imageWidth: number;
    imageHeight: number;

    constructor(
        projectId: string,
        image: AssetModels.Asset,
        model: TransformedImageModel | null = null
    ) {
        super(image);

        this.imageWidth = image.imageWidth ? image.imageWidth : 0;
        this.imageHeight = image.imageHeight ? image.imageHeight : 0;

        this.baseImageUrl = `${this.imageEndpoint}/${projectId}/${image.fileReference.id}/${image.fileName}`;

        if (model && model.transforms) {
            try {
                this.transforms = new Transforms(model.transforms);
                return;
            } catch (error) {
                console.log(error);
            }
        }
        this.transforms = {
            crop: {
                type: OPTIONAL_CONFIG.editorDefaultCropType,
                box: { xFloat: -1, yFloat: -1, wFloat: -1, hFloat: -1 },
                zoom: { xFloat: -1, yFloat: -1, zFloat: -1 },
                frame: { wFloat: -1, hFloat: -1 }
            },
            resize: {
                type: OPTIONAL_CONFIG.editorDefaultResizeType,
                scale: { wFloat: -1, hFloat: -1 },
                fit: { wFloat: -1, hFloat: -1 },
                devicePixelRatio: -1
            },
            background: {
                color: new Color({ r: 0, g: 0, b: 0 })
            },
            format: {
                format: Format.Original,
                autoWebp: false,
                lossless: null,
                quality: 0
            }
        };
    }

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

    static canBeLosslessFormat(format: Format): boolean {
        return format === Format.Jpg
            || format === Format.Pjpg
            || format === Format.Webp;
    }

    cannotHaveAlpha(): boolean {
        if (this.transforms.format) {
            switch (this.transforms.format.format) {
                case Format.Gif:
                    return true;
            }
        }

        const nonAlphaImageTypes = [
            "image/gif"
        ];

        return nonAlphaImageTypes.indexOf(this.type) > -1;
    }

    canBeTransparent(): boolean {
        if (this.transforms.format) {
            switch (this.transforms.format.format) {
                case Format.Jpg:
                case Format.Pjpg:
                    return false;
            }
        }

        const transparentImageTypes = [
            "image/png",
            "image/gif",
            "image/webp"
        ];

        return transparentImageTypes.indexOf(this.type) > -1;
    }

    equals(image: TransformedImage): boolean {
        return this.id === image.id;
    }

    buildUrl(): ImageUrlBuilder {
        return new ImageUrlBuilder(this.baseImageUrl);
    }

    buildEditingUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();

        return builder
            .withWidth(1000)
            .withHeight(1000);
    }

    buildCropUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();
        const { crop } = this.transforms;

        switch (crop.type) {
            case CropType.box:
                if (crop.box.xFloat >= 0
                    && crop.box.yFloat >= 0
                    && crop.box.wFloat >= 0
                    && crop.box.hFloat >= 0) {
                    builder
                        .withRectangleCrop(
                            NumberUtils.toRounded(crop.box.xFloat * this.imageWidth),
                            NumberUtils.toRounded(crop.box.yFloat * this.imageHeight),
                            NumberUtils.toRounded(crop.box.wFloat * this.imageWidth),
                            NumberUtils.toRounded(crop.box.hFloat * this.imageHeight)
                        );
                }
                break;
            case CropType.zoom:
                if (crop.zoom.xFloat >= 0
                    && crop.zoom.yFloat >= 0
                    && crop.zoom.zFloat >= 0) {
                    builder
                        .withFocalPointCrop(crop.zoom.xFloat, crop.zoom.yFloat, crop.zoom.zFloat);
                }
                break;
            case CropType.frame:
                if (crop.frame.wFloat >= 0
                    && crop.frame.hFloat >= 0) {
                    // Fit=crop does not work with floats
                    builder
                        .withRectangleCrop(
                            NumberUtils.toRounded((1 - crop.frame.wFloat) / 2, 2),
                            NumberUtils.toRounded((1 - crop.frame.hFloat) / 2, 2),
                            crop.frame.wFloat,
                            crop.frame.hFloat
                        );
                }
                break;
        }

        return builder;
    }

    buildResizeUrl(): ImageUrlBuilder {
        const builder = this.buildCropUrl();
        const { crop, resize } = this.transforms;

        switch (resize.type) {
            case ResizeType.scale:
                // Scale does not work with zoom
                if (crop.type !== CropType.zoom
                    && resize.scale.wFloat !== null
                    && resize.scale.wFloat >= 0
                    && resize.scale.hFloat !== null
                    && resize.scale.hFloat >= 0) {
                    builder
                        .withFitMode(ImageFitModeEnum.Scale)
                        .withWidth(resize.scale.wFloat)
                        .withHeight(resize.scale.hFloat);
                }
                if (crop.type !== CropType.zoom
                    && resize.devicePixelRatio !== null
                    && resize.devicePixelRatio >= 0
                    && (resize.scale.wFloat !== null
                        && resize.scale.wFloat >= 0
                        || resize.scale.hFloat !== null
                        && resize.scale.hFloat >= 0)) {
                    builder.withDpr(resize.devicePixelRatio);
                }
                break;
            case ResizeType.fit:
                if (crop.type !== CropType.zoom
                    && resize.fit.wFloat !== null
                    && resize.fit.wFloat >= 0
                    && resize.fit.hFloat !== null
                    && resize.fit.hFloat >= 0) {
                    builder
                        .withFitMode(ImageFitModeEnum.Clip)
                        .withWidth(resize.fit.wFloat)
                        .withHeight(resize.fit.hFloat);
                }
                if (crop.type !== CropType.zoom
                    && resize.devicePixelRatio !== null
                    && resize.devicePixelRatio >= 0
                    && (resize.fit.wFloat !== null
                        && resize.fit.wFloat >= 0
                        || resize.fit.hFloat !== null
                        && resize.fit.hFloat >= 0)) {
                    builder.withDpr(resize.devicePixelRatio);
                }
                break;
        }

        return builder;
    }

    buildBackgroundUrl(): ImageUrlBuilder {
        const builder = this.buildResizeUrl();
        const { background } = this.transforms;

        if (background.color && !background.color.isEmpty()) {
            builder.withCustomParam("bg", background.color.toShortHexString(true));
        }

        return builder;
    }

    buildFormatUrl(): ImageUrlBuilder {
        const builder = this.buildBackgroundUrl();
        const { format } = this.transforms;

        if (format.format && format.format !== Format.Original) {
            builder.withCustomParam("fm", format.format.toLowerCase());
        }

        if (format.autoWebp) {
            builder.withCustomParam("auto", Format.Webp.toLowerCase());
        }

        if (format.lossless === ImageCompressionEnum.Lossless) {
            builder.withCompression(format.lossless);
        }

        if (format.quality) {
            builder.withQuality(format.quality);
        }

        return builder;
    }

    buildPreviewUrl(): ImageUrlBuilder {
        return this.buildFormatUrl();
    }

    getDeliveryModel(): FieldModels.AssetModel {
        return new TransformedImageModel(
            this.fileName,
            this.type,
            this.size,
            this.descriptions[0].description,
            this.buildPreviewUrl().getUrl(),
            this.id,
            this.transforms
        );
    }
};