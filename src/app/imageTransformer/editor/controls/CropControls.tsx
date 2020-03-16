import React, { ReactNode } from 'react';

import { ICropTransform } from '../../shared/Transforms';
import { BoxActions } from '../actions/BoxActions';
import { FrameActions } from '../actions/FrameActions';
import { ZoomActions } from '../actions/ZoomActions';
import { NumberInput } from '../inputs/NumberInput';
import { NumberInputType } from '../inputs/NumberInputType';
import { BaseControls, IBaseControlsProps } from './BaseControls';
import { IRectProps } from './IRectProps';
import { SVGOverlay } from './SVGOverlay';

interface ICropControlsProps extends IBaseControlsProps<ICropTransform> {}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransform, {}> {
  onClickSidebar() {}

  updateTransform = () => {
    if (this.actionParams.action !== 'none') {
      const { type } = this.props.transform;

      switch (type) {
        case 'frame':
          this.setTransform({ frame: new FrameActions().getTransform(this.currentRectProps) });
          break;
        case 'box':
          this.setTransform({ box: new BoxActions().getTransform(this.currentRectProps) });
          break;
        case 'zoom':
          this.setTransform({ zoom: new ZoomActions().getTransform(this.currentRectProps) });
          break;
      }

      this.actionParams.action = 'none';
    }

    return true;
  };

  getImageOverlay() {
    const { type, frame, box, zoom } = this.props.transform;

    let rectProps: IRectProps = this.noRectProps;

    if (this.actionParams.action !== 'none') {
      switch (type) {
        case 'box':
          rectProps = new BoxActions().getEditingRect(this.actionParams, box);
          break;
        case 'zoom':
          rectProps = new ZoomActions().getEditingRect(this.actionParams, zoom);
          break;
        case 'frame':
          rectProps = new FrameActions().getEditingRect(this.actionParams, frame);
          break;
      }
    } else {
      switch (type) {
        case 'frame':
          rectProps = new FrameActions().getPassiveRect(frame);
          break;
        case 'box':
          rectProps = new BoxActions().getPassiveRect(box);
          break;
        case 'zoom':
          if (zoom.zFloat > 0) {
            rectProps = new ZoomActions().getPassiveRect(zoom);
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

    return (
      <SVGOverlay
        rectProps={rectProps}
        canDrag={type !== 'frame'}
        isSelecting={this.actionParams.action === 'selecting'}
      />
    );
  }

  renderInputs(crop: ICropTransform): ReactNode {
    const { type, frame, box, zoom } = crop;

    if (this.props.imageHeight && this.props.imageWidth) {
      switch (type) {
        case 'box':
          return (
            <div className='fields vertical' key={'box'}>
              <div className='fieldsBlock'>
                <NumberInput
                  type={this.defaultNumberType}
                  allowedTypes={this.allowedNumberTypes}
                  value={this.getZeroOrNull(box.xFloat)}
                  max={this.props.imageWidth}
                  tooltip='Start X'
                  setValue={value => {
                    crop.box.xFloat = value;
                    this.setTransform({ box: crop.box });
                  }}
                />
                <NumberInput
                  type={this.defaultNumberType}
                  allowedTypes={this.allowedNumberTypes}
                  value={this.getZeroOrNull(box.yFloat)}
                  max={this.props.imageHeight}
                  tooltip='Start Y'
                  setValue={value => {
                    crop.box.yFloat = value;
                    this.setTransform({ box: crop.box });
                  }}
                />
              </div>
              <div className='fieldsBlock'>
                <NumberInput
                  type={this.defaultNumberType}
                  allowedTypes={this.allowedNumberTypes}
                  value={this.getZeroOrNull(box.wFloat)}
                  max={this.props.imageWidth}
                  tooltip='Width'
                  setValue={value => {
                    crop.box.wFloat = value;
                    this.setTransform({ box: crop.box });
                  }}
                />
                <NumberInput
                  type={this.defaultNumberType}
                  allowedTypes={this.allowedNumberTypes}
                  value={this.getZeroOrNull(box.hFloat)}
                  max={this.props.imageHeight}
                  tooltip='Height'
                  setValue={value => {
                    crop.box.hFloat = value;
                    this.setTransform({ box: crop.box });
                  }}
                />
              </div>
            </div>
          );
        case 'zoom':
          return (
            <div className='fields vertical' key={'zoom'}>
              <div className='fieldsBlock'>
                <NumberInput
                  type={this.defaultNumberType}
                  allowedTypes={this.allowedNumberTypes}
                  value={this.getZeroOrNull(zoom.xFloat)}
                  max={this.props.imageWidth}
                  tooltip='Center X'
                  setValue={value => {
                    crop.zoom.xFloat = value;
                    this.setTransform({ zoom: crop.zoom });
                  }}
                />
                <NumberInput
                  type={this.defaultNumberType}
                  allowedTypes={this.allowedNumberTypes}
                  value={this.getZeroOrNull(zoom.yFloat)}
                  max={this.props.imageWidth}
                  tooltip='Center Y'
                  setValue={value => {
                    crop.zoom.yFloat = value;
                    this.setTransform({ zoom: crop.zoom });
                  }}
                />
                <NumberInput
                  type={NumberInputType.float}
                  allowedTypes={[NumberInputType.float]}
                  value={this.getZeroOrNull(zoom.zFloat)}
                  max={100}
                  min={1}
                  tooltip='Zoom'
                  setValue={value => {
                    crop.zoom.zFloat = value;
                    this.setTransform({ zoom: crop.zoom });
                  }}
                />
              </div>
            </div>
          );
        case 'frame':
          return (
            <div className='fields' key={'frame'}>
              <NumberInput
                type={this.defaultNumberType}
                allowedTypes={this.allowedNumberTypes}
                value={this.getZeroOrNull(frame.wFloat)}
                max={this.props.imageWidth}
                tooltip='Width'
                setValue={value => {
                  crop.frame.wFloat = value;
                  this.setTransform({ frame: crop.frame });
                }}
              />
              <NumberInput
                type={this.defaultNumberType}
                allowedTypes={this.allowedNumberTypes}
                value={this.getZeroOrNull(frame.hFloat)}
                max={this.props.imageHeight}
                tooltip='Height'
                setValue={value => {
                  crop.frame.hFloat = value;
                  this.setTransform({ frame: crop.frame });
                }}
              />
            </div>
          );
      }
    }
  }

  renderControls() {
    const crop = this.props.transform;

    return (
      <div>
        <div className='modes'>
          <button
            className={`btn mode ${this.buttonIsSelectedClass(crop.type === 'box')}`}
            onClick={() => this.setTransform({ type: 'box' })}
          >
            Box
          </button>
          <button
            className={`btn mode ${this.buttonIsSelectedClass(crop.type === 'zoom')}`}
            onClick={() => this.setTransform({ type: 'zoom' })}
          >
            Zoom
          </button>
          <button
            className={`btn mode ${this.buttonIsSelectedClass(crop.type === 'frame')}`}
            onClick={() => this.setTransform({ type: 'frame' })}
          >
            Frame
          </button>
        </div>
        {this.renderInputs(crop)}
      </div>
    );
  }
}
