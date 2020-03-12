import React from 'react';

import { ImageCompressionEnum } from '@kentico/kontent-delivery/_commonjs/images/image.models';

import { TransformedImage } from '../../shared/TransformedImage';
import { Format, IFormatTransform } from '../../shared/Transforms';
import { DropdownInput } from '../inputs/DropdownInput';
import { NumberInput } from '../inputs/NumberInput';
import { NumberInputType } from '../inputs/NumberInputType';
import { SwitchInput } from '../inputs/SwitchInput';
import { BaseControls, IBaseControlsProps } from './BaseControls';

interface IFormatControlsProps extends IBaseControlsProps<IFormatTransform> {}

export class FormatControls extends BaseControls<IFormatControlsProps, IFormatTransform, IFormatTransform> {
  onClickSidebar() {}

  updateTransform = () => false;

  getImageOverlay() {
    return <div></div>;
  }

  onClickLossless = () => {
    const format = this.props.transform;
    if (format.lossless !== null) {
      switch (format.lossless) {
        case ImageCompressionEnum.Lossless:
          this.setTransform({ lossless: ImageCompressionEnum.Lossy });
          break;
        case ImageCompressionEnum.Lossy:
          this.setTransform({ lossless: ImageCompressionEnum.Lossless });
          break;
      }
    } else {
      this.setTransform({ lossless: ImageCompressionEnum.Lossless });
    }
  };

  renderControls() {
    const format = this.props.transform;

    return (
      <div>
        <div className='fields vertical'>
          <div className='fieldsBlock'>
            <DropdownInput
              selected={format.format || 'Original'}
              setSelected={selected => {
                this.setTransform({ format: selected as Format });
              }}
              options={Array<Format>('Original', 'GIF', 'PNG', 'PNG8', 'JPG', 'PJPG', 'WEBP')}
              tooltip='Format'
            />
            <SwitchInput
              checked={format.autoWebp}
              onClick={() => this.setTransform({ autoWebp: !format.autoWebp })}
              label='Auto Webp'
            />
          </div>
          <div className='fieldsBlock'>
            {TransformedImage.canBeLosslessFormat(format.format) && (
              <NumberInput
                type={NumberInputType.int}
                allowedTypes={[NumberInputType.int]}
                value={format.quality || null}
                max={100}
                tooltip='Quality'
                disabled={format.lossless === ImageCompressionEnum.Lossless}
                setValue={value => {
                  this.setTransform({ quality: value });
                }}
              />
            )}

            {format.format === 'WEBP' && (
              <SwitchInput
                checked={format.lossless === ImageCompressionEnum.Lossless}
                onClick={this.onClickLossless}
                label='Lossless'
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
