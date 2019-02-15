import * as React from "react";

import { ContentManagementClient } from "kentico-cloud-content-management";
import { AssetModels } from "kentico-cloud-content-management/_bundles/models/assets/asset.models";

import { IElement } from "./kentico/IElement";
import { IContext } from "./kentico/IContext";

import * as styles from "../styles/style.css";

export interface IElementProps {
    element: IElement;
    context: IContext;
}

export interface IElementState {
    assetURLs: string[];
}

// Expose access to Kentico custom element API
declare const CustomElement: any;

export class AdvancedAssetElement extends React.Component<IElementProps, IElementState> {
    state: IElementState = {
        assetURLs: []
    };

    client = new ContentManagementClient({
        projectId: this.props.context.projectId,
        apiKey: this.props.element.config.contentManagementAPIKey
    });

    componentWillMount() {
        const _this = this;

        _this.client.listAssets()
            .toObservable()
            .subscribe(response =>
                _this.filterAssetResponse(response.data.items)
            );
    }

    filterAssetResponse = (items: AssetModels.Asset[]) => {
        const filteredURLs = items
            .filter(i => i.imageWidth !== null)
            .map(i => `https://assets-us-01.kc-usercontent.com:443/${this.props.context.projectId}/${i.fileReference.id}/${i.fileName}`)

        this.setState({
            assetURLs: filteredURLs
        });
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <h1>Here are some assets</h1>
                <div id={styles.assetList}>
                    {this.state.assetURLs.map(u => (
                        <div className={styles.imgWrapper}>
                            <img src={u} />
                        </div>
                    )
                    )}
                </div>
            </div>);
    }
}