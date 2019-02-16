import * as React from "react";

import { AssetModels } from "kentico-cloud-content-management/_bundles/models/assets/asset.models";

import { IContext } from "./kentico/IContext";

import * as styles from "../styles/style.scss";

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
        return `${this.assetEndpoint}/${this.props.context.projectId}/${item.fileReference.id}/${item.fileName}?w=200&h=200`;
    }

    render() {
        return (
            <div className={styles.assetThumbnailWrapper}>
                <div className={styles.assetThumbnail}>
                    <div className={styles.assetThumbnailActionsPane}>
                        <a target="_blank" download={this.props.asset.fileName} href={this.getAssetUrl(this.props.asset)} className={styles.assetThumbnailAction + " " + styles.assetThumbnailActionDownload}>
                            <i aria-hidden="true" className="icon-download" />
                        </a>
                        <div className={styles.assetThumbnailAction + " " + styles.assetThumbnailActionRemove}>
                            <i aria-hidden="true" className="icon-remove" />
                        </div>
                    </div>
                    <div>
                        <div className={styles.assetThumbnailPreview}>
                            <img className={styles.assetThumbnailImage} src={this.getAssetUrl(this.props.asset)} />
                        </div>
                        <div className={styles.assetThumbnailBottom + " " + styles.assetThumbnailBottomWithPadding}>
                            <div className={styles.assetThumbnailSummary}>
                                <div className={styles.assetThumbnailTitle}>
                                    <div className={styles.assetThumbnailName}>
                                        <span className={styles.assetThumbnailFileNameWithoutExtension}>
                                            {this.props.asset.fileName}
                                        </span>
                                    </div>
                                </div>
                                <span className={styles.assetThumbnailTechDetails}>
                                    < span className={
                                        styles.assetThumbnailTechDetail
                                    }>
                                        <span className={styles.assetThumbnailFileSize}>{this.props.asset.size}</span>
                                    </span>
                                    <span className={styles.assetThumbnailTechDetail}>{this.props.asset.lastModified}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}