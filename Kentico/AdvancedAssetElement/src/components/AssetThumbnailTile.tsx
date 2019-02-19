import * as React from "react";
import * as moment from "moment";

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

export class AssetThumbnailTile extends React.Component<IAssetThumbnailProps, IAssetThumbnailState> {
    assetEndpoint: string = "https://assets-us-01.kc-usercontent.com";

    state: IAssetThumbnailState = {
    };

    getAssetUrl = (item: AssetModels.Asset): string => {
        return `${this.assetEndpoint}/${this.props.context.projectId}/${item.fileReference.id}/${item.fileName}?w=400&h=400`;
    }

    getAssetFileSize = (sizeInBytes: number): string => {
        let finalSize = sizeInBytes;
        let unit = "B";

        // GigaBytes
        if (sizeInBytes > (1024 * 1024 * 1024)) {
            finalSize = sizeInBytes / 1024 / 1024 / 1024;
            unit = "GB";
        }
        // MegaBytes
        else if (sizeInBytes > (1024 * 1024)) {
            finalSize = sizeInBytes / 1024 / 1024;
            unit = "MB";
        }
        // KiloBytes
        else if (sizeInBytes > (1024)) {
            finalSize = sizeInBytes / 1024;
            unit = "kB";
        }

        return `${Number(finalSize).toFixed(2)} ${unit}`;
    }

    getAssetLastModified(lastModified: Date): string {
        return this._printDate(lastModified);
    }

    _printDate(date: Date): string {
        return moment(date).format('MMM D, YYYY');
    }

    _printTime(date: Date, includeSeconds: boolean = false): string {
        return moment(date).format('h:mm' + (includeSeconds ? ':ss' : '') + ' a');
    }

    _printDatetime(date: Date, includeSeconds: boolean = false): string {
        return this._printDate(date) + ' \u00B7 ' + this._printTime(date, includeSeconds);
    }

    render() {
        return (
            <div className="assetThumbnailWrapper">
                <div className="assetThumbnail">
                    <div className="assetThumbnailActionsPane">
                        <div className="assetThumbnailAction assetThumbnailActionAddParams">
                            <i aria-hidden="true" className="icon-add-params" />
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
                                        <span className="assetThumbnailFileSize">{this.getAssetFileSize(this.props.asset.size)}</span>
                                    </span>
                                    <span className="assetThumbnailTechDetail">{this.getAssetLastModified(this.props.asset.lastModified)}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}