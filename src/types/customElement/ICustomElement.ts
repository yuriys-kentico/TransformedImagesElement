import { IContext } from "./IContext";
import { IElementConfig } from "./IElementConfig";
import { ITransforms } from "../transformedImage/Transforms";

export interface ICustomElement {
    value: string | null; // Initial value of a Custom element
    disabled: boolean; // Indicates whether an element is disabled for editing
    config: IElementConfig | null; // Element configuration object specified in the UI in a content type or a content type snippet
    init: (callback: (element: ICustomElement, context: IContext) => void) => void;
    setValue: (value: string) => void;
    setHeight: (value: number) => void;
    onDisabledChanged: (callback: (disabled: boolean) => void) => void;
    selectAssets: (config: ISelectAssetConfig) => Promise<IAssetReference[]>;
    getAssetDetails: (assetIds: Array<String>) => Promise<Array<IAssetDetails>>
};

export interface ISelectAssetConfig {
    allowMultiple: boolean;
    fileType: AssetFileTypes;
}

export interface IAssetReference {
    id: string
}

export enum AssetFileTypes {
    all = "all",
    images = "images"
}

export interface IAssetDetails {
    id: string,
    descriptions: AssetDescription[],
    fileName: string,
    imageHeight: number | null,
    imageWidth: number | null,
    name: string,
    size: number,
    thumbnailUrl: string,
    title: string,
    type: string,
    url: string
}

export class TransformedAsset implements IAssetDetails {
    id: string;
    descriptions: AssetDescription[];
    fileName: string;
    imageHeight: number;
    imageWidth: number;
    name: string;
    size: number;
    thumbnailUrl: string;
    title: string;
    type: string;
    url: string;

    transforms: ITransforms;
}

export interface AssetDescription {
    language: LanguageDefinition,
    description: string
}

export interface LanguageDefinition {
    id: string,
    codename: string
}