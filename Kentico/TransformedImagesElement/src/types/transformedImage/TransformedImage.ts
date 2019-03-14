import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";
import { ImageFitModeEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { TransformedImageModel } from "./TransformedImageModel";
import { IImageTransforms, ResizeType, CropType } from "./IImageTransforms";

import { Color } from '../../components/editor/controls/BackgroundControls';

export class TransformedImage extends AssetModels.Asset {
    private imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";
    private baseImageUrl: string;

    transforms: IImageTransforms = {
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

        if (model && model.transforms) {
            this.transforms = model.transforms;
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

    private static isRepeatedCharacter = (value: string, count: number) => new RegExp(`(.)\\1{${count - 1}}$`).test(value);

    static getBackgroundColor(color: Color): string {
        const { a, r, g, b } = color.argb;

        const rHex = r.toString(16);
        const gHex = g.toString(16);
        const bHex = b.toString(16);

        const aHex = a !== 0 ? Math.round((a * 255)).toString(16) : "";
        const a0 = this.isRepeatedCharacter(aHex, 2) ? aHex[0] : "";

        if (this.isRepeatedCharacter(rHex, 2)
            && this.isRepeatedCharacter(gHex, 2)
            && this.isRepeatedCharacter(bHex, 2)
        ) {
            return `${a0}${rHex[0]}${gHex[0]}${bHex[0]}`;
        } else if (this.isRepeatedCharacter(aHex, 2)) {
            return `${a0}${rHex}${gHex}${bHex}`;
        } else {
            return `${aHex}${rHex}${gHex}${bHex}`;
        }
    }

    buildUrl(): ImageUrlBuilder {
        return new ImageUrlBuilder(this.baseImageUrl);
    }

    buildEditedUrl(): ImageUrlBuilder {
        const builder = this.buildUrl();
        const { crop, resize, background } = this.transforms;

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