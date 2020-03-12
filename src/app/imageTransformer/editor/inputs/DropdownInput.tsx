import React, { FC } from 'react';

export interface IDropdownInputProps {
  selected: string;
  setSelected(selected: string): void;
  options: string[];
  tooltip: string;
}

export const DropdownInput: FC<IDropdownInputProps> = ({ tooltip, selected, setSelected, options }) => (
  <span className='input' data-balloon={tooltip} data-balloon-pos='down'>
    <select className='form__dropdown' value={selected} onChange={s => setSelected(s.target.value)}>
      {options.map((option, index) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  </span>
);
