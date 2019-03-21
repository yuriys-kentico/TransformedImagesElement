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

    constructor(
        projectId: string,
        image: AssetModels.Asset,
        model: TransformedImageModel | null = null
    ) {
        super(image);

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
                box: { xFloat: 0, yFloat: 0, wFloat: 0, hFloat: 0 },
                zoom: { xFloat: 0, yFloat: 0, zFloat: 0 },
                frame: { wFloat: 0, hFloat: 0 }
            },
            resize: {
                type: OPTIONAL_CONFIG.editorDefaultResizeType,
                scale: { wFloat: 0, hFloat: 0 },
                fit: { wFloat: 0, hFloat: 0 },
                devicePixelRatio: 0
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

    buildEditedUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();
        const { crop, resize, background, format } = this.transforms;

        switch (crop.type) {
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
            case CropType.frame:
                if (crop.frame.wFloat > 0
                    && crop.frame.hFloat > 0) {
                    // Fit=crop does not work with floats
                    builder
                        .withRectangleCrop(
                            NumberUtils.toRounded((1 - crop.frame.wFloat) / 2, 2),
                            NumberUtils.toRounded((1 - crop.frame.hFloat) / 2, 2),
                            crop.frame.wFloat, crop.frame.hFloat);
                }
                break;
        }

        switch (resize.type) {
            case ResizeType.scale:
                if (resize.scale.wFloat > 0
                    && resize.scale.hFloat > 0) {
                    builder
                        .withFitMode(ImageFitModeEnum.Scale)
                        .withWidth(resize.scale.wFloat)
                        .withHeight(resize.scale.hFloat);
                }
                break;
            case ResizeType.fit:
                if (resize.fit.wFloat > 0
                    && resize.fit.hFloat > 0) {
                    builder
                        .withFitMode(ImageFitModeEnum.Clip)
                        .withWidth(resize.fit.wFloat)
                        .withHeight(resize.fit.hFloat);
                }
                break;
        }

        if (background.color && !background.color.isEmpty()) {
            builder.withCustomParam("bg", background.color.toShortHexString(true));
        }

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

    buildHoverUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();

        return builder
            .withWidth(1000)
            .withHeight(1000);
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