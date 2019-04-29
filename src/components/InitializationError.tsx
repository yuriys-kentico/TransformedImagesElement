import * as React from "react";

import { ICustomElement } from "../types/customElement/ICustomElement";
import { IElementConfig, IRequiredConfig } from "../types/customElement/IElementConfig";

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export interface IErrorProps {
    error: Error;
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
            listAssetsEndpoint: "<Endpoint URL providing an asset listing response for the project. See https://developer.kenticocloud.com/docs/sensitive-information-for-custom-elements for more.>",
            [nameof<IElementConfig>(i => i.editorDefaultToPreview)]: "<Optional: 'true' or 'false' (without quotes) to preview transformations in the editor by default>",
            [nameof<IElementConfig>(i => i.editorDefaultCropType)]: "<Optional: One of the following default crop modes: 'box', 'zoom', 'frame'>",
            [nameof<IElementConfig>(i => i.editorDefaultResizeType)]: "<Optional: One of the following default resize modes: 'scale', 'fit'>",
            [nameof<IElementConfig>(i => i.colorPickerDefaultColors)]: "<Optional: Array of default colors like ['#RRGGBBAA', '#4caf50', ...]>"
        }

        return (
            <div
                className="configuration"
                ref={e => this.configuration = e}
            >
                <div className="details">
                    <strong>Error: </strong>
                    {this.props.error ? this.props.error.message : ""}
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