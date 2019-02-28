import * as React from "react";

import { AssetModels } from "kentico-cloud-content-management/_commonjs/models/assets/asset.models";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";

import { IContext } from "./kentico/IContext";

export interface IImageEditorProps {
    image: AssetModels.Asset;
    context: IContext;
}

export class ImageEditor extends React.Component<IImageEditorProps, {}> {
    imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";

    getImageUrl(item: AssetModels.Asset): string {
        if (item) {
            return new ImageUrlBuilder(`${this.imageEndpoint}/${this.props.context.projectId}/${item.fileReference.id}/${item.fileName}`)
                .withWidth(1000)
                .withHeight(1000)
                .getUrl();
        }
    }

    render() {
        return (
            <div className="editor">
                <div className="imageEditorPreview">
                    <img
                        className="imageEditorImage"
                        src={this.getImageUrl(this.props.image)}
                    />
                </div>
            </div>
        );
    }
}