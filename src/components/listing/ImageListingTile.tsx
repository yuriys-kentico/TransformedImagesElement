import * as React from "react";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";

import { AssetDetails } from "./AssetDetails";
import { If } from "../If";

export interface IimageListingProps {
    image: TransformedImage;
    showActions: boolean;
    isSelected: boolean;
    onSelect(image: TransformedImage): void;
    onRemove(image: TransformedImage): void;
    onAddParams(image: TransformedImage): void;
}

export class ImageListingTile extends React.PureComponent<IimageListingProps> {
    getImageUrl(item: TransformedImage): string {
        return item.buildPreviewUrl()
            .withWidth(400)
            .withHeight(400)
            .getUrl();
    }

    IsSelected(): boolean {
        return this.props.isSelected;
    }

    onSelect() {
        if (this.props.onSelect) {
            return this.props.onSelect(this.props.image);
        }
    }

    render() {
        return (
            <div className="imageListingWrapper">
                <div className={`imageListing ${this.IsSelected() ? "selected" : ""}`}>
                    <div className="imageListingActionsPane">
                        <If shouldRender={this.props.showActions}>
                            <div
                                className="imageListingAction imageListingActionAddParams"
                                onClick={() => this.props.onAddParams(this.props.image)}
                                data-balloon="Edit transformations"
                                data-balloon-pos="down"
                            >
                                <i aria-hidden="true" className="icon-add-params" />
                            </div>
                            <a
                                className="imageListingAction imageListingActionDownload"
                                target="_blank"
                                href={this.getImageUrl(this.props.image)}
                                hidden={true}
                                data-balloon="Download"
                                data-balloon-pos="down"
                            >
                                <i aria-hidden="true" className="icon-download" />
                            </a>
                            <div
                                className="imageListingAction imageListingActionRemove"
                                onClick={() => this.props.onRemove(this.props.image)}
                                data-balloon="Remove"
                                data-balloon-pos="down"
                            >
                                <i aria-hidden="true" className="icon-remove" />
                            </div>
                        </If>
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