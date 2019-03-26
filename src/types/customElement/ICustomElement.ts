import { IContext } from "./IContext";
import { IElementConfig } from "./IElementConfig";

export interface ICustomElement {
    value: string | null; // Initial value of a Custom element
    disabled: boolean; // Indicates whether an element is disabled for editing
    config: IElementConfig | null; // Element configuration object specified in the UI in a content type or a content type snippet
    init: (callback: (element: ICustomElement, context: IContext) => void) => void;
    setValue: (value: string) => void;
    setHeight: (value: number) => void;
    onDisabledChanged: (callback: (disabled: boolean) => void) => void;
};