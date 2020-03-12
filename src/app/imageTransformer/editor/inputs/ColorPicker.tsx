import React, { FC, useContext } from 'react';
import { ColorChangeHandler, CustomPicker, SketchPicker } from 'react-color';

import { CustomElementContext } from '../../CustomElementContext';
import { Color } from '../../shared/Color';
import { Checkerboard } from '../Checkerboard';

interface IColorPickerProps {
  isPickerOpen: boolean;
  disableAlpha: boolean;
  togglePicker(): void;
  tooltip: string;
  value: Color;
  setValue: ColorChangeHandler;
}

const ColorPicker: FC<IColorPickerProps> = ({ tooltip, isPickerOpen, value, setValue, disableAlpha, togglePicker }) => {
  const { colorPickerDefaultColors } = useContext(CustomElementContext);

  return (
    <span
      className='input'
      data-balloon={tooltip}
      data-balloon-pos='down'
      onClick={e => (isPickerOpen ? e.stopPropagation() : null)}
    >
      {isPickerOpen && (
        <div className='picker'>
          <SketchPicker
            color={value.rgba.a === 0 ? value.toRgb() : value.toPickerFormat()}
            onChange={setValue}
            disableAlpha={disableAlpha}
            presetColors={colorPickerDefaultColors}
          />
        </div>
      )}
      <button
        className='btn colorBox'
        onClick={togglePicker}
        style={{
          background: value.toCssRgba()
        }}
      />
      <div
        className='colorBoxBackground'
        style={{ background: `url(${Checkerboard.generate('transparent', 'rgba(0,0,0,.08)', 8)}) center left` }}
      />
    </span>
  );
};

export default CustomPicker(ColorPicker);
