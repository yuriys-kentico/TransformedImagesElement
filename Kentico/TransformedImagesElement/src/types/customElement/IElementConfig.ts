export interface IOptionalConfig {
    editorDefaultToPreview: boolean;
    colorPickerDefaultColors: string[]
}
export interface IRequiredConfig {
    contentManagementAPIKey: string;
}

export interface IElementConfig extends IOptionalConfig, IRequiredConfig {
}

export const OPTIONAL_CONFIG: IOptionalConfig = {
    editorDefaultToPreview: false,
    colorPickerDefaultColors: ["#D0021B", "#F5A623", "#F8E71C", "#7ED321", "#417505",
        "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2", "#B8E986", "#000000",
        "#4A4A4A", "#9B9B9B", "#FFFFFF"]
}