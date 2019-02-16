import * as React from "react";

import { AssetModels } from "kentico-cloud-content-management/_bundles/models/assets/asset.models";

import { IContext } from "./kentico/IContext";

export interface IAssetThumbnailProps {
    asset: AssetModels.Asset;
    context: IContext;
}

export interface IAssetThumbnailState {
}

// Expose access to Kentico custom element API
declare const CustomElement: any;

export class AssetThumbnail extends React.Component<IAssetThumbnailProps, IAssetThumbnailState> {
    assetEndpoint: string = "https://assets-us-01.kc-usercontent.com";

    state: IAssetThumbnailState = {
    };

    getAssetUrl = (item: AssetModels.Asset): string => {
        return `${this.assetEndpoint}/${this.props.context.projectId}/${item.fileReference.id}/${item.fileName}?w=400&h=400`;
    }

    render() {
        return (
            <div className="assetThumbnailWrapper">
                <div className="assetThumbnail">
                    <div className="assetThumbnailActionsPane">
                        <div className="assetThumbnailAction assetThumbnailActionAddParams">
                            <i aria-hidden="true" className="iconAddParams" />
                        </div>
                        <a target="_blank" href={this.getAssetUrl(this.props.asset)} className="assetThumbnailAction assetThumbnailActionDownload">
                            <i aria-hidden="true" className="icon-download" />
                        </a>
                        <div className="assetThumbnailAction assetThumbnailActionRemove">
                            <i aria-hidden="true" className="icon-remove" />
                        </div>
                    </div>
                    <div>
                        <div className="assetThumbnailPreview">
                            <img className="assetThumbnailImage" src={this.getAssetUrl(this.props.asset)} />
                        </div>
                        <div className="assetThumbnailBottom assetThumbnailBottomWithPadding">
                            <div className="assetThumbnailSummary">
                                <div className="assetThumbnailTitle">
                                    <div className="assetThumbnailName">
                                        <span className="assetThumbnailFileNameWithoutExtension">
                                            {this.props.asset.fileName}
                                        </span>
                                    </div>
                                </div>
                                <span className="assetThumbnailTechDetails">
                                    <span className="assetThumbnailTechDetail">
                                        <span className="assetThumbnailFileSize">{this.props.asset.size}</span>
                                    </span>
                                    <span className="assetThumbnailTechDetail">{this.props.asset.lastModified.toDateString()}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}