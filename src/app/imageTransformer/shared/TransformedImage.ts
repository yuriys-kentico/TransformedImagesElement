import { ImageUrlBuilder } from '@kentico/kontent-delivery/_commonjs/images/image-url-builder';
import {
    ImageCompressionEnum,
    ImageFitModeEnum
} from '@kentico/kontent-delivery/_commonjs/images/image.models';

import { toRounded } from '../../../utilities/numbers';
import { Color } from './Color';
import { IAssetDescription } from './IAssetDescription';
import { IAssetDetails } from './IAssetDetails';
import { IContext } from './IContext';
import { ICustomElementConfig } from './ICustomElementConfig';
import { Format, ITransforms, Transforms } from './Transforms';

export interface ITransformedImage {
  id: string;
  description: string;
  height: number;
  width: number;
  name: string;
  title: string;
  size: number;
  type: string;
  url: string;
  transformedUrl: string | undefined;
  transforms: ITransforms;
  cannotHaveAlpha(): boolean;
  canBeTransparent(): boolean;
  buildEditingUrl(): ImageUrlBuilder;
  buildCropUrl(): ImageUrlBuilder;
  buildPreviewUrl(): ImageUrlBuilder;
  getDeliveryModel(): ITransformedImage;
}

export class TransformedImage implements ITransformedImage {
  id: string;
  description: string;
  width: number;
  height: number;
  name: string;
  title: string;
  size: number;
  type: string;
  url: string;
  transformedUrl: string | undefined;
  transforms: ITransforms;

  constructor(
    assetDetails: IAssetDetails,
    description: string,
    customElementConfig: ICustomElementConfig,
    transforms?: ITransforms
  ) {
    const { id, imageWidth, imageHeight, name, title, size, type, url } = assetDetails;

    this.id = id;
    this.description = description;
    this.width = imageWidth!;
    this.height = imageHeight!;
    this.name = name;
    this.title = title;
    this.size = size;
    this.type = type;
    this.url = url;

    if (transforms) {
      this.transforms = new Transforms(transforms);
    } else {
      this.transforms = new Transforms({
        crop: {
          type: customElementConfig.editorDefaultCropType,
          box: { xFloat: -1, yFloat: -1, wFloat: -1, hFloat: -1 },
          zoom: { xFloat: -1, yFloat: -1, zFloat: -1 },
          frame: { wFloat: -1, hFloat: -1 }
        },
        resize: {
          type: customElementConfig.editorDefaultResizeType,
          scale: { wFloat: -1, hFloat: -1 },
          fit: { wFloat: -1, hFloat: -1 },
          devicePixelRatio: -1
        },
        background: {
          color: new Color({ r: 0, g: 0, b: 0 })
        },
        format: {
          format: 'Original',
          autoWebp: false,
          lossless: null,
          quality: 0
        }
      });
    }
  }

  static getDescription(imageAsset: IAssetDetails, context: IContext) {
    const description = imageAsset.descriptions.find(description => description.language.id === context.variant.id);

    return (description && description.description) || '';
  }

  static canBeLosslessFormat(format: Format): boolean {
    return format === 'JPG' || format === 'PJPG' || format === 'WEBP';
  }

  cannotHaveAlpha(): boolean {
    if (this.transforms.format) {
      switch (this.transforms.format.format) {
        case 'GIF':
          return true;
      }
    }

    const nonAlphaImageTypes = ['image/gif'];

    return nonAlphaImageTypes.indexOf(this.type) > -1;
  }

  canBeTransparent(): boolean {
    if (this.transforms.format) {
      switch (this.transforms.format.format) {
        case 'JPG':
        case 'PJPG':
          return false;
      }
    }

    const transparentImageTypes = ['image/png', 'image/gif', 'image/webp'];

    return transparentImageTypes.indexOf(this.type) > -1;
  }

  buildUrl(): ImageUrlBuilder {
    return new ImageUrlBuilder(this.url);
  }

  buildEditingUrl(): ImageUrlBuilder {
    const builder = this.buildUrl();

    return builder.withWidth(1000).withHeight(1000);
  }

  buildCropUrl(): ImageUrlBuilder {
    const builder = this.buildUrl();
    const { crop } = this.transforms;

    switch (crop.type) {
      case 'box':
        if (crop.box.xFloat >= 0 && crop.box.yFloat >= 0 && crop.box.wFloat >= 0 && crop.box.hFloat >= 0) {
          builder.withRectangleCrop(
            toRounded(crop.box.xFloat * this.width),
            toRounded(crop.box.yFloat * this.height),
            toRounded(crop.box.wFloat * this.width),
            toRounded(crop.box.hFloat * this.height)
          );
        }
        break;
      case 'zoom':
        if (crop.zoom.xFloat >= 0 && crop.zoom.yFloat >= 0 && crop.zoom.zFloat >= 0) {
          builder.withFocalPointCrop(crop.zoom.xFloat, crop.zoom.yFloat, crop.zoom.zFloat);
        }
        break;
      case 'frame':
        if (crop.frame.wFloat >= 0 && crop.frame.hFloat >= 0) {
          // Fit=crop does not work with floats
          builder.withRectangleCrop(
            toRounded((1 - crop.frame.wFloat) / 2, 2),
            toRounded((1 - crop.frame.hFloat) / 2, 2),
            crop.frame.wFloat,
            crop.frame.hFloat
          );
        }
        break;
    }

    return builder;
  }

  buildResizeUrl(): ImageUrlBuilder {
    const builder = this.buildCropUrl();
    const { crop, resize } = this.transforms;

    switch (resize.type) {
      case 'scale':
        // Scale does not work with zoom
        if (
          crop.type !== 'zoom' &&
          resize.scale.wFloat !== null &&
          resize.scale.wFloat >= 0 &&
          resize.scale.hFloat !== null &&
          resize.scale.hFloat >= 0
        ) {
          builder
            .withFitMode(ImageFitModeEnum.Scale)
            .withWidth(resize.scale.wFloat)
            .withHeight(resize.scale.hFloat);
        }
        if (
          crop.type !== 'zoom' &&
          resize.devicePixelRatio !== null &&
          resize.devicePixelRatio >= 0 &&
          ((resize.scale.wFloat !== null && resize.scale.wFloat >= 0) ||
            (resize.scale.hFloat !== null && resize.scale.hFloat >= 0))
        ) {
          builder.withDpr(resize.devicePixelRatio);
        }
        break;
      case 'fit':
        if (
          crop.type !== 'zoom' &&
          resize.fit.wFloat !== null &&
          resize.fit.wFloat >= 0 &&
          resize.fit.hFloat !== null &&
          resize.fit.hFloat >= 0
        ) {
          builder
            .withFitMode(ImageFitModeEnum.Clip)
            .withWidth(resize.fit.wFloat)
            .withHeight(resize.fit.hFloat);
        }
        if (
          crop.type !== 'zoom' &&
          resize.devicePixelRatio !== null &&
          resize.devicePixelRatio >= 0 &&
          ((resize.fit.wFloat !== null && resize.fit.wFloat >= 0) ||
            (resize.fit.hFloat !== null && resize.fit.hFloat >= 0))
        ) {
          builder.withDpr(resize.devicePixelRatio);
        }
        break;
    }

    return builder;
  }

  buildBackgroundUrl(): ImageUrlBuilder {
    const builder = this.buildResizeUrl();
    const { background } = this.transforms;

    if (background.color && !background.color.isEmpty()) {
      builder.withCustomParam('bg', background.color.toShortHexString(true));
    }

    return builder;
  }

  buildFormatUrl(): ImageUrlBuilder {
    const builder = this.buildBackgroundUrl();
    const { format } = this.transforms;

    if (format.format && format.format !== 'Original') {
      builder.withCustomParam('fm', format.format.toLowerCase());
    }

    if (format.autoWebp) {
      builder.withCustomParam('auto', 'webp');
    }

    if (format.lossless === ImageCompressionEnum.Lossless) {
      builder.withCompression(format.lossless);
    }

    if (format.quality) {
      builder.withQuality(format.quality);
    }

    return builder;
  }

  buildPreviewUrl(): ImageUrlBuilder {
    return this.buildFormatUrl();
  }

  getDeliveryModel() {
    this.transformedUrl = this.buildPreviewUrl().getUrl();
    return this;
  }
}
