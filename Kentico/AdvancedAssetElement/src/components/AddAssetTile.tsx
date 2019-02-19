import * as React from "react";
import * as moment from "moment";

import { AssetModels } from "kentico-cloud-content-management/_bundles/models/assets/asset.models";

import { IContext } from "./kentico/IContext";

export interface IAddAssetTileProps {
}

export interface IAddAssetTileState {
}

// Expose access to Kentico custom element API
declare const CustomElement: any;

export class AddAssetTile extends React.Component<IAddAssetTileProps, IAddAssetTileState> {
    state: IAddAssetTileState = {
    };

    render() {
        return (
            <div className="assetThumbnailWrapper">
                <div className="assetUploader">
                    <i aria-hidden="true" className="icon-upload" />
                    <div>Drop assets to upload,&nbsp;
                        <span>
                            <input type="file" multiple={true} style={{ display: "none" }} />
                            <a>browse</a>
                        </span>
                        <br />
                        or
                        <br />
                        <button className="btn btn--secondary btn--xs">
                            Pick from Asset library
                        </button>
                    </div>
                </div>
            </div >
        );
    }
}