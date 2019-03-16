import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";
import { ImageFitModeEnum, ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { TransformedImageModel } from "./TransformedImageModel";
import { ITransforms, CropType, Transforms } from "./Transforms";
import { Color } from "./Color";

export class TransformedImage extends AssetModels.Asset {
    private imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";
    private baseImageUrl: string;

    transforms: ITransforms;

    constructor(
        projectId: string,
        image?: AssetModels.Asset,
        model?: TransformedImageModel
    ) {
        super(image);

        this.baseImageUrl = `${this.imageEndpoint}/${projectId}/${image.fileReference.id}/${image.fileName}`;

        if (model && model.transforms) {
            this.transforms = new Transforms(model.transforms);
        } else {
            this.transforms = new Transforms({
                crop: {
                    type: CropType.scale,
                    scale: { xFloat: 0, yFloat: 0 },
                    fit: { xFloat: 0, yFloat: 0 },
                    frame: { xFloat: 0, yFloat: 0 },
                    box: { xFloat: 0, yFloat: 0, wFloat: 0, hFloat: 0 },
                    zoom: { xFloat: 0, yFloat: 0, zFloat: 0 },
                    resize: { xFloat: 0, yFloat: 0 },
                    devicePixelRatio: 0
                },
                background: {
                    color: new Color({ r: 0, g: 0, b: 0 })
                },
                format: {
                    format: null,
                    autoWebp: false,
                    lossless: null,
                    quality: 0
                }
            });
        }
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

    buildUrl(): ImageUrlBuilder {
        return new ImageUrlBuilder(this.baseImageUrl);
    }

    buildEditedUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();
        const { crop, background, format } = this.transforms;

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
                        .withRectangleCrop((1 - crop.frame.xFloat) / 2, (1 - crop.frame.yFloat) / 2, crop.frame.xFloat, crop.frame.yFloat);
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

        if (background.color && !background.color.isEmpty()) {
            builder.withCustomParam("bg", background.color.toShortHexString());
        }

        if (format.format) {
            builder.withFormat(format.format);
        }

        if (format.autoWebp) {
            builder.withAutomaticFormat(format.format);
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