import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";

import { TransformedImageModel } from "./TransformedImageModel";
import { IImageTransformations, ResizeType, CropType } from "./IImageTransformations";
import { ImageFitModeEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";
import { ColorResult } from "react-color";

export class TransformedImage extends AssetModels.Asset {
    private imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";
    private baseImageUrl: string;

    transformations: IImageTransformations = {
        resize: {
            type: ResizeType.fit
        },
        crop: {
            type: CropType.full
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
        const { resize, background } = this.transformations;

        if ((resize.height > 0
            || resize.width > 0)
            && resize.type) {
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

        if (resize.height > 0) {
            builder.withHeight(resize.height);
        }

        if (resize.width > 0) {
            builder.withWidth(resize.width);
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