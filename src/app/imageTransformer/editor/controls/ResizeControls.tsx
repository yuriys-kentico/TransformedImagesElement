import React, { ReactNode } from 'react';

import { toRounded } from '../../../../utilities/numbers';
import { ICropTransform, IResizeTransform } from '../../shared/Transforms';
import { FitActions } from '../actions/FitActions';
import { ScaleActions } from '../actions/ScaleActions';
import { NumberInput } from '../inputs/NumberInput';
import { NumberInputType } from '../inputs/NumberInputType';
import { BaseControls, IBaseControlsProps } from './BaseControls';
import { IRectProps } from './IRectProps';
import { SVGOverlay } from './SVGOverlay';

interface IResizeControlsProps extends IBaseControlsProps<IResizeTransform> {
  cropTransform: ICropTransform;
}

export class ResizeControls extends BaseControls<IResizeControlsProps, IResizeTransform, {}> {
  onClickSidebar() {}

  updateTransform = () => {
    if (this.actionParams.action !== 'none') {
      const { type } = this.props.transform;

      switch (type) {
        case 'scale':
          this.setTransform({ scale: new ScaleActions().getTransform(this.currentRectProps) });
          break;
        case 'fit':
          this.setTransform({ fit: new FitActions().getTransform(this.currentRectProps) });
          break;
      }

      this.actionParams.action = 'none';
    }

    return true;
  };

  getImageOverlay() {
    const { type, scale, fit } = this.props.transform;

    let rectProps: IRectProps = { ...this.noRectProps };

    if (this.actionParams.action !== 'none') {
      switch (type) {
        case 'scale':
          rectProps = new ScaleActions().getEditingRect(this.actionParams, scale);
          break;
        case 'fit':
          rectProps = new FitActions().getEditingRect(this.actionParams, fit);
          break;
      }
    } else {
      switch (type) {
        case 'scale':
          if (scale.hFloat > 0 && scale.wFloat > 0) {
            rectProps = new ScaleActions().getPassiveRect(scale);
          } else {
            rectProps = this.noRectProps;
          }
          break;
        case 'fit':
          if (fit.hFloat > 0 && fit.wFloat > 0) {
            rectProps = new FitActions().getPassiveRect(fit);
          } else {
            rectProps = this.noRectProps;
          }
          break;
      }
    }

    rectProps = this.ensureRectWithinImage(rectProps);

    if (rectProps.height === 0 && rectProps.width === 0) {
      rectProps = this.noRectProps;
    }

    this.currentRectProps = rectProps;

    return <SVGOverlay rectProps={rectProps} canDrag={false} isSelecting={this.actionParams.action === 'selecting'} />;
  }

  getImageHeight(): number {
    const { imageHeight, cropTransform } = this.props;

    if (imageHeight) {
      switch (cropTransform.type) {
        case 'box':
          return toRounded(cropTransform.box.hFloat * imageHeight);

        case 'zoom':
          return toRounded(cropTransform.zoom.zFloat * imageHeight);

        case 'frame':
          return toRounded(cropTransform.frame.hFloat * imageHeight);

        default:
          return imageHeight;
      }
    }

    return 0;
  }

  getImageWidth(): number {
    const { imageWidth, cropTransform } = this.props;

    if (imageWidth) {
      switch (cropTransform.type) {
        case 'box':
          return toRounded(cropTransform.box.wFloat * imageWidth);

        case 'zoom':
          return toRounded(cropTransform.zoom.zFloat * imageWidth);

        case 'frame':
          return toRounded(cropTransform.frame.wFloat * imageWidth);

        default:
          return imageWidth;
      }
    }

    return 0;
  }

  renderInputs(resize: IResizeTransform): ReactNode {
    const { type, scale, fit } = resize;

    if (this.props.imageHeight && this.props.imageWidth) {
      switch (type) {
        case 'scale':
          return (
            <div className='fields' key={'scale'}>
              <NumberInput
                type={this.defaultNumberType}
                allowedTypes={this.allowedNumberTypes}
                value={this.getZeroOrNull(scale.wFloat)}
                max={this.getImageWidth()}
                tooltip='Width'
                setValue={value => {
                  resize.scale.wFloat = value;
                  this.setTransform({ scale: resize.scale });
                  this.forceUpdate();
                }}
              />
              <NumberInput
                type={this.defaultNumberType}
                allowedTypes={this.allowedNumberTypes}
                value={this.getZeroOrNull(scale.hFloat)}
                max={this.getImageHeight()}
                tooltip='Height'
                setValue={value => {
                  resize.scale.hFloat = value;
                  this.setTransform({ scale: resize.scale });
                }}
              />
              <NumberInput
                type={NumberInputType.float}
                allowedTypes={[NumberInputType.float]}
                value={this.getZeroOrNull(resize.devicePixelRatio)}
                max={5}
                min={0}
                tooltip='Device Pixel Ratio'
                disabled={resize.scale.hFloat === 0 && resize.scale.wFloat === 0}
                setValue={value => {
                  this.setTransform({ devicePixelRatio: value });
                }}
              />
            </div>
          );
        case 'fit':
          return (
            <div className='fields' key={'fit'}>
              <NumberInput
                type={this.defaultNumberType}
                allowedTypes={this.allowedNumberTypes}
                value={this.getZeroOrNull(fit.wFloat)}
                max={this.getImageWidth()}
                tooltip='Width'
                setValue={value => {
                  resize.fit.wFloat = value;
                  this.setTransform({ fit: resize.fit });
                }}
              />
              <NumberInput
                type={this.defaultNumberType}
                allowedTypes={this.allowedNumberTypes}
                value={this.getZeroOrNull(fit.hFloat)}
                max={this.getImageHeight()}
                tooltip='Height'
                setValue={value => {
                  resize.fit.hFloat = value;
                  this.setTransform({ fit: resize.fit });
                }}
              />
              <NumberInput
                type={NumberInputType.float}
                allowedTypes={[NumberInputType.float]}
                value={this.getZeroOrNull(resize.devicePixelRatio)}
                max={5}
                min={0}
                tooltip='Device Pixel Ratio'
                disabled={resize.fit.hFloat === 0 && resize.fit.wFloat === 0}
                setValue={value => {
                  this.setTransform({ devicePixelRatio: value });
                }}
              />
            </div>
          );
      }
    }
  }

  renderControls() {
    const resize = this.props.transform;

    return (
      <div>
        <div className='modes'>
          <button
            className={`btn mode ${this.buttonIsSelectedClass(resize.type === 'fit')}`}
            onClick={() => this.setTransform({ type: 'fit' })}
          >
            Fit
          </button>
          <button
            className={`btn mode ${this.buttonIsSelectedClass(resize.type === 'scale')}`}
            onClick={() => this.setTransform({ type: 'scale' })}
          >
            Scale
          </button>
        </div>
        {this.renderInputs(resize)}
      </div>
    );
  }
}
