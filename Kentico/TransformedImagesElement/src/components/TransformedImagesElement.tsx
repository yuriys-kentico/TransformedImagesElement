import * as React from "react";

import { ContentManagementClient } from "kentico-cloud-content-management";
import { AssetModels } from "kentico-cloud-content-management/_commonjs/models/assets/asset.models";

import { IElement } from "./kentico/IElement";
import { IContext } from "./kentico/IContext";

import { ImageListingTile } from "./ImageListingTile";
import { OpenSelectionBar } from "./OpenSelectionBar";
import { TransformedImagesElementMode } from "./TransformedImagesElementMode";
import { CloseSelectionBar } from "./CloseSelectionBar";
import { fail } from "assert";
import { ImageEditor } from "./ImageEditor";

export interface IElementProps {
    element: IElement;
    context: IContext;
}

export interface IElementState {
    rawAssets: AssetModels.Asset[];
    selectedImages: AssetModels.Asset[];
    previousSelectedImages: AssetModels.Asset[];
    editedImage: AssetModels.Asset;
    mode: TransformedImagesElementMode;
}

// Expose access to Kentico custom element API
declare const CustomElement: any;

export class TransformedImagesElement extends React.Component<IElementProps, IElementState> {
    selectionList: HTMLDivElement;
    listingList: HTMLDivElement;
    editor: HTMLDivElement;

    state: IElementState = {
        rawAssets: [],
        selectedImages: [],
        previousSelectedImages: [],
        editedImage: null,
        mode: TransformedImagesElementMode.listing
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

    setMode = (mode: TransformedImagesElementMode) => {
        this.setState({
            mode: mode
        })
    }

    selectImage(image: AssetModels.Asset): any {
        // Deselect image
        if (this.state.selectedImages.includes(image)) {
            this.setState({
                selectedImages: this.state.selectedImages.filter(a => a != image)
            })
        }
        // Select image
        else {
            this.setState({
                selectedImages: [...this.state.selectedImages, image]
            })
        }
    }

    storeCurrentSelectedImages() {
        this.setState({
            previousSelectedImages: [...this.state.selectedImages]
        })
    }

    revertSelectedImages() {
        this.setState({
            selectedImages: [...this.state.previousSelectedImages]
        })
    }

    openEditor(image: AssetModels.Asset): void {
        this.setState({
            editedImage: image
        })

        this.setMode(TransformedImagesElementMode.editor);
    }

    updateHeight = () => {
        let renderedHeight: number;

        switch (this.state.mode) {
            case TransformedImagesElementMode.editor:
                renderedHeight = this.editor.scrollHeight;
                break;
            case TransformedImagesElementMode.listing:
                renderedHeight = this.listingList.scrollHeight;
                break;
            case TransformedImagesElementMode.selection:
                renderedHeight = this.selectionList.scrollHeight;
                break;
        }

        CustomElement.setHeight(renderedHeight);
    }

    componentDidMount = this.updateHeight;

    componentDidUpdate = this.updateHeight;

    render() {
        return (
            <div>
                <div
                    className="imageSelection"
                    hidden={this.state.mode == TransformedImagesElementMode.selection ? false : true}
                    ref={e => this.selectionList = e}
                >
                    <div className="list">
                        {this.state.rawAssets.map((a, i) => (
                            <ImageListingTile
                                image={a}
                                key={i}
                                context={this.props.context}
                                showActions={false}
                                isSelected={this.state.selectedImages.includes(a)}
                                onSelect={image => this.selectImage(image)}
                            />
                        )
                        )}
                    </div>
                    <CloseSelectionBar
                        onClickCancel={() => { this.revertSelectedImages(); this.setMode(TransformedImagesElementMode.listing) }}
                        onClickUpdate={() => { this.setMode(TransformedImagesElementMode.listing) }}
                    />
                </div>
                <div
                    className="imageListing"
                    hidden={this.state.mode == TransformedImagesElementMode.listing ? false : true}
                    ref={e => this.listingList = e}
                >
                    <OpenSelectionBar
                        onClickPick={() => { this.storeCurrentSelectedImages(); this.setMode(TransformedImagesElementMode.selection) }}
                    />
                    <div className="list">
                        {this.state.selectedImages.map((a, i) => (
                            <ImageListingTile
                                image={a}
                                key={i}
                                context={this.props.context}
                                showActions={true}
                                isSelected={false}
                                onRemove={image => this.selectImage(image)}
                                onSelect={image => this.openEditor(image)}
                                onAddParams={image => this.openEditor(image)}
                            />
                        )
                        )}
                    </div>
                </div>
                <div
                    className="imageEditor"
                    hidden={this.state.mode == TransformedImagesElementMode.editor ? false : true}
                    ref={e => this.editor = e}
                >
                    <ImageEditor
                        image={this.state.editedImage}
                        context={this.props.context}
                    />
                    <CloseSelectionBar
                        onClickCancel={() => { this.setMode(TransformedImagesElementMode.listing) }}
                        onClickUpdate={() => { this.setMode(TransformedImagesElementMode.listing) }}
                    />
                </div>
            </div>
        );
    }
}