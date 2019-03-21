import { ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

import { Color } from './Color';

export interface ITransforms {
    crop: ICropTransform;
    resize: IResizeTransform;
    background: IBackgroundTransform;
    format: IFormatTransform;
}

export enum CropType {
    box = "box",
    zoom = "zoom",
    frame = "frame"
}

export enum ResizeType {
    scale = "scale",
    fit = "fit"
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
    box: XYTransform & WHTransform,
    zoom: XYTransform & ZTransform,
    frame: WHTransform
}

export interface IResizeTransform {
    type: ResizeType;
    scale: WHTransform,
    fit: WHTransform,
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
    resize: IResizeTransform;
    background: IBackgroundTransform;
    format: IFormatTransform;

    constructor(transforms: ITransforms) {
        const { crop, resize, background, format } = transforms;

        this.crop = {
            type: crop.type,
            [CropType.frame]: { ...crop.frame },
            [CropType.box]: { ...crop.box },
            [CropType.zoom]: { ...crop.zoom }
        };
        this.resize = {
            type: resize.type,
            [ResizeType.scale]: { ...resize.scale },
            [ResizeType.fit]: { ...resize.fit },
            devicePixelRatio: resize.devicePixelRatio
        };
        this.background = {
            color: background.color
                ? new Color(background.color.internalRgba)
                : new Color({ r: 0, g: 0, b: 0 })
        };
        this.format = { ...format };
    }

    static clone(transforms: ITransforms): ITransforms {
        const { crop, resize, background, format } = transforms;

        return {
            crop: {
                type: crop.type,
                [CropType.frame]: { ...crop.frame },
                [CropType.box]: { ...crop.box },
                [CropType.zoom]: { ...crop.zoom }
            },
            resize: {
                type: resize.type,
                [ResizeType.scale]: { ...resize.scale },
                [ResizeType.fit]: { ...resize.fit },
                devicePixelRatio: resize.devicePixelRatio
            },
            background: { ...background },
            format: { ...format }
        }
    }
}