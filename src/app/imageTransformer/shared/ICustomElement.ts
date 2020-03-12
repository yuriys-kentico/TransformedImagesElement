import { IAssetDetails } from './IAssetDetails';
import { IContext } from './IContext';
import { ICustomElementConfig } from './ICustomElementConfig';

interface IAssetReference {
  id: string;
}

interface ISelectAssetConfig {
  allowMultiple: boolean;
  fileType: 'all' | 'images';
}

export interface ICustomElement {
  value: string | null;
  disabled: boolean;
  config: ICustomElementConfig | null;
  init: (callback: (element: ICustomElement, context: IContext) => void) => void;
  setValue: (value: string) => void;
  setHeight: (value: number) => void;
  onDisabledChanged: (callback: (disabled: boolean) => void) => void;
  selectAssets: (config: ISelectAssetConfig) => Promise<IAssetReference[]>;
  getAssetDetails: (assetIds: string[]) => Promise<IAssetDetails[]>;
}
