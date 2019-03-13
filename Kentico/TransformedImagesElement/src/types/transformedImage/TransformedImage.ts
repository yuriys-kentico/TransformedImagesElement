import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";

import { TransformedImageModel } from "./TransformedImageModel";
import { IImageTransformations, ResizeType, CropType } from "./IImageTransformations";
import { ImageFitModeEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";
import { ColorResult } from "react-color";
import { create } from "domain";

export class TransformedImage extends AssetModels.Asset {
    private imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";
    private baseImageUrl: string;

    transformations: IImageTransformations = {
        resize: {
            type: ResizeType.fit
        },
        crop: {
            type: CropType.border
        },
        background: {},
        format: {}
    };

    constructor(
        projectId: string,
        image?: AssetModels.Asset,
        model?: TransformedImageModel
    ) {
        super(image);

        this.baseImageUrl = `${this.imageEndpoint}/${projectId}/${image.fileReference.id}/${image.fileName}`;

        if (model && model.transformations) {
            this.transformations = model.transformations;
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

    private getBackgroundColor(color: ColorResult): string {
        if (color.rgb.a != 1) {
            return Number(Math.round(color.rgb.a * 255)).toString(16) + color.hex.substr(1);
        }
        return color.hex.substr(1);
    }

    buildUrl(): ImageUrlBuilder {
        return new ImageUrlBuilder(this.baseImageUrl);
    }

    buildEditedUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();
        const { crop, resize, background } = this.transformations;

        switch (crop.type) {
            case CropType.box:
                if (crop.widthPercent > 0
                    && crop.heightPercent > 0
                    && crop.xPercent > 0
                    && crop.yPercent > 0) {
                    builder.withRectangleCrop(crop.xPercent, crop.yPercent, crop.widthPercent, crop.heightPercent);
                }
                break;
            case CropType.zoom:
                if (crop.xPercent > 0
                    && crop.yPercent > 0
                    && crop.zoom > 0) {
                    builder.withFocalPointCrop(crop.xPercent, crop.yPercent, crop.zoom);
                }
                break;
        }

        if ((resize.heightPercent > 0
            || resize.widthPercent > 0)
            && crop.type === CropType.border) {
            switch (resize.type) {
                case ResizeType.crop:
                    builder.withFitMode(ImageFitModeEnum.Crop);
                    break;
                case ResizeType.fit:
                    builder.withFitMode(ImageFitModeEnum.Clip);
                    break;
                case ResizeType.scale:
                    builder.withFitMode(ImageFitModeEnum.Scale);
                    break;
                default:
            }
        }

        if (resize.heightPercent > 0) {
            builder.withHeight(resize.heightPercent);
        }

        if (resize.widthPercent > 0) {
            builder.withWidth(resize.widthPercent);
        }

        if (resize.devicePixelRatio) {
            builder.withDpr(resize.devicePixelRatio);
        }

        if (background.color && background.color.hex) {
            builder.withCustomParam("bg", this.getBackgroundColor(background.color));
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
            this.transformations
        );
    }
};