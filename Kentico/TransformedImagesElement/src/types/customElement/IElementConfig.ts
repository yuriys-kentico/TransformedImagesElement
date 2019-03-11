export interface IOptionalConfig {
    editorDefaultToPreview: boolean;
    colorPickerDefaultColors: string[]
}
export interface IRequiredConfig {
    contentManagementAPIKey: string;
}

export interface IElementConfig extends IOptionalConfig, IRequiredConfig {
}