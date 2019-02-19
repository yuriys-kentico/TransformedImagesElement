import * as React from "react";

import { ContentManagementClient } from "kentico-cloud-content-management";
import { AssetModels } from "kentico-cloud-content-management/_bundles/models/assets/asset.models";

import { IElement } from "./kentico/IElement";
import { IContext } from "./kentico/IContext";

import { AssetThumbnailTile } from "./AssetThumbnailTile";
import { AddAssetTile } from "./AddAssetTile";

export interface IElementProps {
    element: IElement;
    context: IContext;
}

export interface IElementState {
    rawAssets: AssetModels.Asset[];
    selectedAssets: AssetModels.Asset[];
}

// Expose access to Kentico custom element API
declare const CustomElement: any;

export class AdvancedAssetElement extends React.Component<IElementProps, IElementState> {
    thumbnailList: HTMLDivElement;

    state: IElementState = {
        rawAssets: [],
        selectedAssets: []
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
        this.setState({
            rawAssets: items
                .filter(i => i.imageWidth !== null)
        });
    }

    componentDidUpdate() {
        const renderedHeight = this.thumbnailList.clientHeight;

        CustomElement.setHeight(renderedHeight);
    }

    render() {
        return (
            <div className="assetThumbnailList" ref={e => this.thumbnailList = e}>
                <AddAssetTile />
                {this.state.selectedAssets.map((a, i) => (
                    <AssetThumbnailTile asset={a} key={i} context={this.props.context} />
                )
                )}
            </div>
        );
    }
}