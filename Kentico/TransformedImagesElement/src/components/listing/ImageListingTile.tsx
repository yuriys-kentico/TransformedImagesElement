import * as React from "react";

import { AssetModels } from "kentico-cloud-content-management/_commonjs/models/assets/asset.models";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";

import { IContext } from "../../types/kentico/IContext";
import { TransformedImage } from "../../types/TransformedImage";

import { AssetDetails } from "./AssetDetails";

export interface IimageListingProps {
    image: TransformedImage;
    context: IContext;
    showActions: boolean;
    isSelected: boolean;
    onSelect(image: TransformedImage): void;
    onRemove?(image: TransformedImage): void;
    onAddParams?(image: TransformedImage): void;
}

export class ImageListingTile extends React.Component<IimageListingProps, {}> {
    getImageUrl(item: TransformedImage): string {
        return item.buildUrl()
            .withWidth(400)
            .withHeight(400)
            .getUrl();
    }

    IsSelected(): boolean {
        return this.props.isSelected;
    }

    onSelect(): void {
        if (this.props.onSelect) {
            return this.props.onSelect(this.props.image);
        }
    }

    render() {
        let actions: JSX.Element[] = null;

        if (this.props.showActions) {
            actions = [
                <div
                    className="imageListingAction imageListingActionAddParams"
                    onClick={() => this.props.onAddParams(this.props.image)}
                    key="addParams"
                >
                    <i aria-hidden="true" className="icon-add-params" />
                </div>,
                <a
                    className="imageListingAction imageListingActionDownload"
                    target="_blank"
                    href={this.getImageUrl(this.props.image)}
                    hidden={true}
                    key="download"
                >
                    <i aria-hidden="true" className="icon-download" />
                </a>,
                <div
                    className="imageListingAction imageListingActionRemove"
                    onClick={() => this.props.onRemove(this.props.image)}
                    key="remove"
                >
                    <i aria-hidden="true" className="icon-remove" />
                </div>
            ];
        }

        return (
            <div className="imageListingWrapper">
                <div className={`imageListing ${this.IsSelected() ? "selected" : ""}`}>
                    <div className="imageListingActionsPane">
                        {actions}
                    </div>
                    <div
                        className="imageListingPreview"
                        onClick={() => this.onSelect()}
                    >
                        <img
                            className="imageListingImage"
                            src={this.getImageUrl(this.props.image)}
                        />
                    </div>
                    <div className="imageListingBottom">
                        <AssetDetails image={this.props.image} />
                    </div>
                </div>
            </div >
        );
    }
}