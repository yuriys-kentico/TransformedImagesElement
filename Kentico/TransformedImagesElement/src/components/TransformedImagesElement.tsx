import * as React from "react";

import { ContentManagementClient } from "kentico-cloud-content-management";
import { AssetModels } from "kentico-cloud-content-management/_commonjs/models/assets/asset.models";

import { IElement } from "../types/kentico/IElement";
import { IContext } from "../types/kentico/IContext";
import { ICustomElement } from "../types/kentico/ICustomElement";
import { IElementConfig } from "../types/IElementConfig";
import { TransformedImagesElementMode } from "../types/TransformedImagesElementMode";
import { TransformedImage } from "../types/TransformedImage";

import { ImageListingTile } from "./listing/ImageListingTile";
import { ListingButtons } from "./listing/ListingButtons";
import { SelectionButtons } from "./selection/SelectionButtons";
import { ImageEditor } from "./editor/ImageEditor";

export interface IElementProps {
    element: IElement;
    context: IContext;
}

export interface IElementState {
    rawImages: TransformedImage[];
    selectedImages: TransformedImage[];
    previousSelectedImages: TransformedImage[];
    editedImage: TransformedImage;
    mode: TransformedImagesElementMode;
    configurationError: Error
}

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export class TransformedImagesElement extends React.Component<IElementProps, IElementState> {
    configuration: HTMLDivElement;
    selectionList: HTMLDivElement;
    listingList: HTMLDivElement;
    editor: HTMLDivElement;

    state: IElementState = {
        rawImages: [],
        selectedImages: [],
        previousSelectedImages: [],
        editedImage: null,
        mode: TransformedImagesElementMode.unset,
        configurationError: null
    };

    componentWillMount() {
        const _this = this;

        try {
            const client = new ContentManagementClient({
                projectId: this.props.context.projectId,
                apiKey: this.props.element.config.contentManagementAPIKey
            });

            client.listAssets()
                .toObservable()
                .subscribe(
                    response => _this.filterAssetResponse(response.data.items),
                    error => _this.showError(error)
                );
        } catch (error) {
            this.showError(error);
        }
    }

    showError(error: any): void {
        this.setState({
            configurationError: error,
            mode: TransformedImagesElementMode.configuration
        })
    }

    filterAssetResponse = (items: AssetModels.Asset[]) => {
        const rawImages = items
            .filter(i => i.imageWidth !== null)
            .map(a => new TransformedImage(this.props.context.projectId, a));

        const selectedIds = this.loadSelectedIds(this.props.element.value);

        this.setState({
            rawImages: rawImages,
            mode: TransformedImagesElementMode.listing,
            selectedImages:
                rawImages
                    .filter(i => selectedIds.includes(i.asset.id))
                    .sort((a, b) => selectedIds.indexOf(a.asset.id) - selectedIds.indexOf(b.asset.id))
        });
    }

    loadSelectedIds(value: string): string[] {
        if (value !== null) {
            return TransformedImage.parseDeliveryModels(JSON.parse(value));
        }

        return [];
    }

    setMode = (mode: TransformedImagesElementMode) => {
        this.setState({
            mode: mode
        })
    }

    selectImage(image: TransformedImage): any {
        // Deselect image
        if (this.state.selectedImages.includes(image)) {
            this.setState({
                selectedImages: this.state.selectedImages.filter(a => a !== image)
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

    openEditor(image: TransformedImage) {
        this.setState({
            editedImage: image
        })

        this.setMode(TransformedImagesElementMode.editor);
    }

    updateValue(selectedImages: TransformedImage[]) {
        CustomElement.setValue(
            JSON.stringify(
                selectedImages
                    .map(i => i.getDeliveryModel())
            )
        );
    }

    updateHeight = () => {
        let renderedHeight: number;

        switch (this.state.mode) {
            case TransformedImagesElementMode.configuration:
                renderedHeight = this.configuration.scrollHeight;
                break;
            case TransformedImagesElementMode.listing:
                renderedHeight = this.listingList.scrollHeight;
                break;
            case TransformedImagesElementMode.selection:
                renderedHeight = this.selectionList.scrollHeight;
                break;
            case TransformedImagesElementMode.editor:
                renderedHeight = this.editor.scrollHeight;
                break;
        }

        if (renderedHeight > 0) {
            CustomElement.setHeight(renderedHeight);
        }

        this.updateValue(this.state.selectedImages);
    }

    componentDidMount = this.updateHeight;

    componentDidUpdate = this.updateHeight;

    render() {
        let currentModeElement: JSX.Element;

        switch (this.state.mode) {
            case TransformedImagesElementMode.configuration:
                const sampleParameters: IElementConfig = {
                    contentManagementAPIKey: "<Key value from Project settings > API Keys > Content Management API>"
                }

                currentModeElement = (
                    <div
                        className="configuration"
                        ref={e => this.configuration = e}
                    >
                        <div className="details">
                            <strong>Error: </strong>
                            {this.state.configurationError.message}
                        </div>
                        <div>
                            <span className="notice">In other words, please make sure the parameters look like this:</span>
                            <pre className="json text-field__input">
                                {JSON.stringify(sampleParameters, null, 4)}
                            </pre>
                        </div>
                    </div>
                );
                break;

            case TransformedImagesElementMode.listing:
                currentModeElement = (
                    <div
                        className="imageListing"
                        ref={e => this.listingList = e}
                    >
                        <ListingButtons
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
                );
                break;

            case TransformedImagesElementMode.selection:
                currentModeElement = (
                    <div
                        className="imageSelection"
                        ref={e => this.selectionList = e}
                    >
                        <div className="list">
                            {this.state.rawImages.map((a, i) => (
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
                        <SelectionButtons
                            onClickCancel={() => { this.revertSelectedImages(); this.setMode(TransformedImagesElementMode.listing) }}
                            onClickUpdate={() => { this.setMode(TransformedImagesElementMode.listing) }}
                        />
                    </div>
                );
                break;

            case TransformedImagesElementMode.editor:
                currentModeElement = (
                    <div
                        className="imageEditor"
                        ref={e => this.editor = e}
                    >
                        <ImageEditor
                            image={this.state.editedImage}
                            context={this.props.context}
                        />
                        <SelectionButtons
                            onClickCancel={() => { this.setMode(TransformedImagesElementMode.listing) }}
                            onClickUpdate={() => { this.setMode(TransformedImagesElementMode.listing) }}
                        />
                    </div>
                );
                break;
        }

        return (
            <div>
                {currentModeElement}
            </div>
        );
    }
}