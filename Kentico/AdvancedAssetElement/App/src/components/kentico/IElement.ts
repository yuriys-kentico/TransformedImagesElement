import { IElementConfig } from "../IElementConfig";

export interface IElement {
    value: string;
    disabled: boolean;
    config: IElementConfig;
}