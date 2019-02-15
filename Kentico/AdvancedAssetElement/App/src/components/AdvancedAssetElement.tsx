import * as React from "react";
import { IElement } from "./kentico/IElement";
import { IContext } from "./kentico/IContext";

export interface IElementProps {
    element: IElement;
    context: IContext;
}

export interface IElementState {
    contentManagementAPIKey: string;
}

export class AdvancedAssetElement extends React.Component<IElementProps, IElementState> {
    state = {
        contentManagementAPIKey: this.props.element.config.contentManagementAPIKey
    };

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <h1>Hello Kentico, here are some assets</h1>
                <h2>{this.state.contentManagementAPIKey}</h2>
            </div>);
    }
}