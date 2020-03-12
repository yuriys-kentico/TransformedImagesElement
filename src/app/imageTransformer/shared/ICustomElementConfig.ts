import { CropType, ResizeType } from './Transforms';

export interface ICustomElementConfig {
  editorDefaultToPreview: boolean;
  editorDefaultCropType: CropType;
  editorDefaultResizeType: ResizeType;
  inputsDefaultToPercent: boolean;
  colorPickerDefaultColors: string[];
}
