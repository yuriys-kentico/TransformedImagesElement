import { ImageCompressionEnum } from '@kentico/kontent-delivery/_commonjs/images/image.models';

import { Color } from './Color';

export interface ITransforms {
  crop: ICropTransform;
  resize: IResizeTransform;
  background: IBackgroundTransform;
  format: IFormatTransform;
}

export type CropType = 'box' | 'zoom' | 'frame';

export type ResizeType = 'scale' | 'fit';

export interface IXYTransform {
  xFloat: number;
  yFloat: number;
}

export interface IWHTransform {
  wFloat: number;
  hFloat: number;
}

export interface IZTransform {
  zFloat: number;
}

export interface ICropTransform {
  type: CropType;
  box: IXYTransform & IWHTransform;
  zoom: IXYTransform & IZTransform;
  frame: IWHTransform;
}

export interface IResizeTransform {
  type: ResizeType;
  scale: IWHTransform;
  fit: IWHTransform;
  devicePixelRatio: number;
}

export interface IBackgroundTransform {
  color: Color;
}

export type Format = 'Original' | 'GIF' | 'PNG' | 'PNG8' | 'JPG' | 'PJPG' | 'WEBP';

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
      frame: { ...crop.frame },
      box: { ...crop.box },
      zoom: { ...crop.zoom }
    };

    this.resize = {
      type: resize.type,
      scale: { ...resize.scale },
      fit: { ...resize.fit },
      devicePixelRatio: resize.devicePixelRatio
    };

    this.background = {
      color: background.color ? new Color(background.color.internalRgba) : new Color({ r: 0, g: 0, b: 0 })
    };

    this.format = { ...format };
  }

  static clone(transforms: ITransforms): ITransforms {
    const { crop, resize, background, format } = transforms;

    return {
      crop: {
        type: crop.type,
        frame: { ...crop.frame },
        box: { ...crop.box },
        zoom: { ...crop.zoom }
      },
      resize: {
        type: resize.type,
        scale: { ...resize.scale },
        fit: { ...resize.fit },
        devicePixelRatio: resize.devicePixelRatio
      },
      background: { ...background },
      format: { ...format }
    };
  }
}
