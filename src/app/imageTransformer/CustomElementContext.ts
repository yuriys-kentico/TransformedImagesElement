import { createContext, Dispatch, SetStateAction } from 'react';

import { IContext } from './shared/IContext';
import { ICustomElementConfig } from './shared/ICustomElementConfig';
import { ITransformedImage } from './shared/TransformedImage';

export interface ICustomElementContext extends ICustomElementConfig {
  itemContext: IContext;
  enabled: boolean;
  selectedImages: ITransformedImage[];
  setSelectedImages: Dispatch<SetStateAction<ITransformedImage[]>>;
  update: () => void;
}

export const defaultCustomElementContext: ICustomElementContext = {
  itemContext: null!,
  enabled: true,
  selectedImages: [],
  setSelectedImages: () => {},
  update: () => {},
  editorDefaultToPreview: false,
  editorDefaultCropType: 'box',
  editorDefaultResizeType: 'fit',
  inputsDefaultToPercent: false,
  colorPickerDefaultColors: [
    '#4caf50',
    '#fb8c00',
    '#ef5350',
    '#fbc02d',
    '#2196f3',
    '#ff9800',
    '#d32f2f',
    '#f5f5f5',
    '#9B9B9B',
    '#616161',
    '#424242',
    '#000000',
    '#FFFFFF'
  ]
};

export const CustomElementContext = createContext<ICustomElementContext>(defaultCustomElementContext);
