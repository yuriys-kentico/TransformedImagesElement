import { ImageFormatEnum, ImageCompressionEnum } from "kentico-cloud-delivery/_commonjs/images/image.models";
import { ColorResult } from "react-color";

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

export interface IResizeTransformation {
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

export interface IBackgroundTransformation {
    color?: ColorResult;
}

export interface IFormatTransformation {
    format?: ImageFormatEnum;
    lossless?: ImageCompressionEnum;
    quality?: number;
    autoWebp?: boolean;
}