import * as React from "react";

import { ICustomElement } from "../types/customElement/ICustomElement";
import { IElementConfig, IRequiredConfig } from "../types/customElement/IElementConfig";

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export interface IErrorProps {
    configurationError: Error;
}

export class InitializationError extends React.Component<IErrorProps> {
    private configuration: HTMLDivElement | null;

    removeDoubleQuotesAndReplaceSingleQuotes(jsonString: string): React.ReactNode {
        return jsonString
            .replace(/(.*: )(")(.*)(")/g, "$1$3")
            .replace(/\'/g, "\"");
    }

    componentDidMount() {
        const renderedHeight = this.configuration ? this.configuration.scrollHeight : 0;

        CustomElement.setHeight(renderedHeight);
    };

    render() {
        const sampleParameters: IRequiredConfig = {
            contentManagementAPIKey: "<Key value from Project settings > API Keys > Content Management API>",
            [nameof<IElementConfig>(i => i.editorDefaultToPreview)]: "<Optional: 'true' or 'false' (without quotes) to preview transformations in the editor by default>",
            [nameof<IElementConfig>(i => i.editorDefaultCropType)]: "<Optional: One of the following default crop modes: 'scale', 'fit', 'frame', 'box', 'zoom'>",
            [nameof<IElementConfig>(i => i.colorPickerDefaultColors)]: "<Optional: Array of default colors like ['#RRGGBBAA', '#4caf50', ...]>"
        }

        return (
            <div
                className="configuration"
                ref={e => this.configuration = e}
            >
                <div className="details">
                    <strong>Error: </strong>
                    {this.props.configurationError ? this.props.configurationError.message : ""}
                </div>
                <div>
                    <span className="notice">In other words, please make sure the parameters look like this:</span>
                    <pre className="json text-field__input">
                        {this.removeDoubleQuotesAndReplaceSingleQuotes(JSON.stringify(sampleParameters, null, 4))}
                    </pre>
                </div>
            </div>
        );
    }
}