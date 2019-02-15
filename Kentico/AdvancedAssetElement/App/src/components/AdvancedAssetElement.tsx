import * as React from "react";
import { IElement } from "./kentico/IElement";
import { IContext } from "./kentico/IContext";

export interface IElementProps {
}

export interface IElementState {
    contentManagementAPIKey: string;
}

declare var CustomElement: any;

export class AdvancedAssetElement extends React.Component<IElementProps, IElementState> {
    constructor(props: Readonly<IElementProps>) {
        super(props);

        CustomElement.init((element: IElement, _context: IContext) => {
            // Set up the element with initial value
            this.state = {
                contentManagementAPIKey: element.config.contentManagementAPIKey
            };
        });
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <h1>Hello Kentico, here are some assets</h1>
                <h2>{this.state.contentManagementAPIKey}</h2>
            </div>);
    }
}