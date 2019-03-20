import { ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { Color } from './Color';

export interface ITransforms {
    crop: ICropTransform;
    background: IBackgroundTransform;
    format: IFormatTransform;
}

export enum CropType {
    scale = "scale",
    fit = "fit",
    frame = "frame",
    box = "box",
    zoom = "zoom"
}

export interface XYTransform {
    xFloat: number;
    yFloat: number;
}

export interface WHTransform {
    wFloat: number;
    hFloat: number;
}

export interface ZTransform {
    zFloat: number;
}

export interface ICropTransform {
    type: CropType;
    scale: XYTransform,
    fit: XYTransform,
    frame: WHTransform,
    box: XYTransform & WHTransform,
    zoom: XYTransform & ZTransform,
    resize: XYTransform,
    devicePixelRatio: number;
}

export interface IBackgroundTransform {
    color: Color;
}

export enum Format {
    Original = "Original",
    Gif = "GIF",
    Png = "PNG",
    Png8 = "PNG8",
    Jpg = "JPG",
    Pjpg = "PJPG",
    Webp = "WEBP"
}

export interface IFormatTransform {
    format: Format;
    autoWebp: boolean;
    lossless: ImageCompressionEnum | null;
    quality: number;
}

export class Transforms implements ITransforms {
    crop: ICropTransform;
    background: IBackgroundTransform;
    format: IFormatTransform;

    constructor(transforms: ITransforms) {
        const { crop, background, format } = transforms;

        this.crop = {
            type: crop.type,
            [CropType.scale]: { ...crop.scale },
            [CropType.fit]: { ...crop.fit },
            [CropType.frame]: { ...crop.frame },
            [CropType.box]: { ...crop.box },
            [CropType.zoom]: { ...crop.zoom },
            resize: { ...crop.resize },
            devicePixelRatio: crop.devicePixelRatio
        };
        this.background = {
            color: background.color
                ? new Color(background.color.internalRgba)
                : new Color({ r: 0, g: 0, b: 0 })
        };
        this.format = { ...format };
    }

    static clone(transforms: ITransforms): ITransforms {
        const { crop, background, format } = transforms;

        return {
            crop: {
                type: crop.type,
                [CropType.scale]: { ...crop.scale },
                [CropType.fit]: { ...crop.fit },
                [CropType.frame]: { ...crop.frame },
                [CropType.box]: { ...crop.box },
                [CropType.zoom]: { ...crop.zoom },
                resize: { ...crop.resize },
                devicePixelRatio: crop.devicePixelRatio
            },
            background: { ...background },
            format: { ...format }
        }
    }
}