import * as React from "react";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";

import { AssetDetails } from "./AssetDetails";
import { Checkerboard } from "../../types/editor/Checkerboard";

export interface IimageListingProps {
    image: TransformedImage;
    showActions: boolean;
    isSelected: boolean;
    onSelect(image: TransformedImage): void;
    onRemove?(image: TransformedImage): void;
    onAddParams?(image: TransformedImage): void;
}

export class ImageListingTile extends React.Component<IimageListingProps> {
    getImageUrl(item: TransformedImage): string {
        return item.buildEditedUrl()
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
                    data-balloon="Edit transformations"
                    data-balloon-pos="down"
                >
                    <i aria-hidden="true" className="icon-add-params" />
                </div>,
                <a
                    className="imageListingAction imageListingActionDownload"
                    target="_blank"
                    href={this.getImageUrl(this.props.image)}
                    hidden={true}
                    key="download"
                    data-balloon="Download"
                    data-balloon-pos="down"
                >
                    <i aria-hidden="true" className="icon-download" />
                </a>,
                <div
                    className="imageListingAction imageListingActionRemove"
                    onClick={() => this.props.onRemove(this.props.image)}
                    key="remove"
                    data-balloon="Remove"
                    data-balloon-pos="down"
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
                        style={{
                            background: `url(${Checkerboard.generate("transparent", "rgba(0,0,0,.02)", 16)}) center left`
                        }}
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