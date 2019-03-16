export interface IOptionalConfig {
    editorDefaultToPreview: boolean;
    inputsDefaultToPercent: boolean;
    colorPickerDefaultColors: string[]
}
export interface IRequiredConfig {
    contentManagementAPIKey: string;
}

export interface IElementConfig extends IOptionalConfig, IRequiredConfig {
}

export const OPTIONAL_CONFIG: IOptionalConfig = {
    editorDefaultToPreview: false,
    inputsDefaultToPercent: false,
    colorPickerDefaultColors: [
        "#4caf50",
        "#fb8c00",
        "#ef5350",
        "#fbc02d",
        "#2196f3",
        "#ff9800",
        "#d32f2f",
        "#f5f5f5",
        "#9B9B9B",
        "#616161",
        "#424242",
        "#000000",
        "#FFFFFF"
    ]
}