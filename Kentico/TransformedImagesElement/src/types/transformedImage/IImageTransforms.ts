import { ImageFormatEnum, ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";
import { Color } from '../../components/editor/controls/BackgroundControls';

export interface IImageTransforms {
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

export interface ICropTransform {
    type: CropType;
    scale: {
        xFloat: number;
        yFloat: number;
    },
    fit: {
        xFloat: number;
        yFloat: number;
    },
    frame: {
        xFloat: number;
        yFloat: number;
    },
    box: {
        xFloat: number;
        yFloat: number;
        wFloat: number;
        hFloat: number;
    },
    zoom: {
        xFloat: number;
        yFloat: number;
        zFloat: number;
    },
    resize: {
        xFloat: number;
        yFloat: number;
    }
    devicePixelRatio: number;
}

export interface IBackgroundTransform {
    color: Color;
}

export interface IFormatTransform {
    format: ImageFormatEnum;
    lossless: ImageCompressionEnum;
    quality: number;
    autoWebp: boolean;
}

export function cloneTransforms(transforms: IImageTransforms): IImageTransforms {
    return {
        crop: {
            type: transforms.crop.type,
            [CropType.scale]: { ...transforms.crop.scale },
            [CropType.fit]: { ...transforms.crop.fit },
            [CropType.frame]: { ...transforms.crop.frame },
            [CropType.box]: { ...transforms.crop.box },
            [CropType.zoom]: { ...transforms.crop.zoom },
            resize: { ...transforms.crop.resize },
            devicePixelRatio: transforms.crop.devicePixelRatio
        },
        background: { ...transforms.background },
        format: { ...transforms.format }
    }
}