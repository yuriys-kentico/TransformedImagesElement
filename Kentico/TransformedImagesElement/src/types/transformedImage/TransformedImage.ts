import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";

import { TransformedImageModel } from "./TransformedImageModel";
import { IImageTransformations, ResizeType, CropType } from "./IImageTransformations";
import { ImageFitModeEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

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

    buildUrl(): ImageUrlBuilder {
        return new ImageUrlBuilder(this.baseImageUrl);
    }

    getImageUrl(): string {
        const builder = this.buildUrl();

        if ((this.transformations.resize.height > 0
            || this.transformations.resize.width > 0)
            && this.transformations.resize.type) {
            switch (this.transformations.resize.type) {
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

        if (this.transformations.resize.height > 0) {
            builder.withHeight(this.transformations.resize.height);
        }

        if (this.transformations.resize.width > 0) {
            builder.withWidth(this.transformations.resize.width);
        }

        if (this.transformations.resize.devicePixelRatio) {
            builder.withDpr(this.transformations.resize.devicePixelRatio);
        }

        if (this.transformations.background.color) {
            builder.withCustomParam("bg", this.transformations.background.color.substr(1));
        }

        return builder.getUrl();
    }

    getDeliveryModel(): FieldModels.AssetModel {
        return new TransformedImageModel(
            this.fileName,
            this.type,
            this.size,
            this.descriptions[0].description,
            this.getImageUrl(),
            this.id,
            this.transformations
        );
    }
};