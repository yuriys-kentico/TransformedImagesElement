import { ImageFormatEnum, ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";
import { Color } from '../../components/editor/controls/BackgroundControls';

export interface IImageTransforms {
    crop: ICropTransform;
    resize: IResizeTransform;
    background: IBackgroundTransform;
    format: IFormatTransform;
}

export interface ICropTransform {
    type?: CropType;
    xPercent?: number;
    yPercent?: number;
    widthPercent?: number;
    heightPercent?: number;
    zoom?: number;
}

export enum CropType {
    border = "Border",
    box = "Box",
    zoom = "Zoom"
}

export interface IResizeTransform {
    type?: ResizeType,
    widthPercent?: number;
    heightPercent?: number;
    devicePixelRatio?: number;
}

export enum ResizeType {
    crop = "Crop",
    fit = "Fit",
    scale = "Scale"
}

export interface IBackgroundTransform {
    color?: Color;
}

export interface IFormatTransform {
    format?: ImageFormatEnum;
    lossless?: ImageCompressionEnum;
    quality?: number;
    autoWebp?: boolean;
}