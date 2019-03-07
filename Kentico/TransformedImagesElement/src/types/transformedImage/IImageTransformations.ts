import { Color } from "csstype";
import { ImageFormatEnum, ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";

/*
Crop:
    full, box, focal
    x, y, width, height | x, y, zoom

Resize:
    crop, fit, scale
    width, height, dpr

Background:
    color, color picker

Format:
    dropdown, lossless, auto
 */

export interface IImageTransformations {
    crop: ICropTransformation;
    resize: IResizeTransformation;
    background: IBackgroundTransformation;
    format: IFormatTransformation;
}

export interface ICropTransformation {
    type: CropType;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zoom?: number;
}

export enum CropType {
    full = "Full",
    box = "Box",
    focal = "Focal"
}

export interface IResizeTransformation {
    type: ResizeType,
    width?: number;
    height?: number;
    devicePixelRatio?: number;
}

export enum ResizeType {
    crop = "Crop",
    fit = "Fit",
    scale = "Scale"
}

export interface IBackgroundTransformation {
    color?: Color;
}

export interface IFormatTransformation {
    format?: ImageFormatEnum;
    lossless?: ImageCompressionEnum;
    quality?: number;
    autoWebp?: boolean;
}