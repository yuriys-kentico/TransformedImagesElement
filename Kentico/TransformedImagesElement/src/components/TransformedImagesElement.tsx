import * as React from "react";
import { ListAssetsQuery } from "kentico-cloud-content-management";

import { IContext } from "../types/customElement/IContext";
import { ICustomElement } from "../types/customElement/ICustomElement";
import { IElementConfig } from "../types/customElement/IElementConfig";
import { TransformedImage } from "../types/transformedImage/TransformedImage";
import { IImageTransformations } from "../types/transformedImage/IImageTransformations";

import { ImageListingTile } from "./listing/ImageListingTile";
import { ListingButtons } from "./listing/ListingButtons";
import { SelectionButtons } from "./selection/SelectionButtons";
import { TransformationsEditor } from "./editor/TransformationsEditor";
import { EditorButtons } from "./editor/EditorButtons";

export enum TransformedImagesElementMode {
    unset,
    configuration,
    listing,
    selection,
    editor
}

export interface IElementProps {
    context?: IContext;
    initialRawImages?: TransformedImage[];
    initialSelectedImages?: TransformedImage[];
    initialMode: TransformedImagesElementMode;
    editorDefaultToPreview?: boolean;
    moreAssetsQuery?: ListAssetsQuery;
    configurationError?: Error;
}

export interface IElementState {
    rawImages: TransformedImage[];
    selectedImages: TransformedImage[];
    previousSelectedImages?: TransformedImage[];
    editedImage?: TransformedImage;
    previousEditedTransformations?: IImageTransformations;
    mode: TransformedImagesElementMode;
    editorUsePreview: boolean;
}

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export class TransformedImagesElement extends React.Component<IElementProps, IElementState> {
    private configuration: HTMLDivElement;
    private selectionList: HTMLDivElement;
    private listingList: HTMLDivElement;
    private editorWrapper: HTMLDivElement;

    state: IElementState = {
        rawImages: this.props.initialRawImages,
        selectedImages: this.props.initialSelectedImages,
        mode: this.props.initialMode,
        editorUsePreview: this.props.editorDefaultToPreview
    };

    setMode = (mode: TransformedImagesElementMode) => {
        this.setState({
            mode: mode
        })
    }

    loadMoreAssets(): void {
        this.props.moreAssetsQuery
            .toObservable()
            .subscribe(response =>
                this.setState(state => ({
                    rawImages: [
                        ...state.rawImages,
                        ...response.data.items
                            .filter(i =>
                                TransformedImage.assetIsImage(i)
                            )
                            .map(a =>
                                new TransformedImage(this.props.context.projectId, a)
                            )
                    ]
                }))
            )
    }

    storeCurrentSelectedImages() {
        this.setState(state => ({
            previousSelectedImages: [...state.selectedImages]
        }))
    }

    revertSelectedImages() {
        this.setState(state => ({
            selectedImages: [...state.previousSelectedImages]
        }))
    }

    storeEditedImage(image: TransformedImage) {
        const transformationsClone = {
            resize: { ...image.transformations.resize },
            crop: { ...image.transformations.crop },
            background: { ...image.transformations.background },
            format: { ...image.transformations.format }
        };

        this.setState({
            editedImage: image,
            previousEditedTransformations: transformationsClone
        },
            this.updateValue
        )
    }

    revertEditedImage() {
        this.state.editedImage.transformations = this.state.previousEditedTransformations;

        this.updateValue();
    }

    selectImage(image: TransformedImage): any {
        // Deselect image
        if (this.state.selectedImages.includes(image)) {
            this.setState((state) => ({
                selectedImages: state.selectedImages.filter(a => a !== image)
            }),
                this.updateValue
            )
        }
        // Select image
        else {
            this.setState((state) => ({
                selectedImages: [...state.selectedImages, image]
            }),
                this.updateValue
            )
        }
    }

    updateValue() {
        CustomElement.setValue(
            JSON.stringify(
                this.state.selectedImages
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
                renderedHeight = this.editorWrapper.scrollHeight;
                break;
        }

        if (renderedHeight > 0) {
            CustomElement.setHeight(renderedHeight);
        }
    }

    componentDidMount = this.updateHeight;

    componentDidUpdate = this.updateHeight;

    render() {
        switch (this.state.mode) {
            case TransformedImagesElementMode.configuration:
                const sampleParameters: IElementConfig = {
                    contentManagementAPIKey: "<Key value from Project settings > API Keys > Content Management API>",
                    editorDefaultToPreview: "<Optional: 'true' or 'false' (without quotes) to preview transformations in the editor by default>"
                }

                return (
                    <div
                        className="configuration"
                        ref={e => this.configuration = e}
                    >
                        <div className="details">
                            <strong>Error: </strong>
                            {this.props.configurationError.message}
                        </div>
                        <div>
                            <span className="notice">In other words, please make sure the parameters look like this:</span>
                            <pre className="json text-field__input">
                                {JSON.stringify(sampleParameters, null, 4)}
                            </pre>
                        </div>
                    </div>
                );

            case TransformedImagesElementMode.listing:
                return (
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
                                    showActions={true}
                                    isSelected={false}
                                    onRemove={image => this.selectImage(image)}
                                    onSelect={image => {
                                        this.storeEditedImage(image);
                                        this.setMode(TransformedImagesElementMode.editor)
                                    }}
                                    onAddParams={image => {
                                        this.storeEditedImage(image);
                                        this.setMode(TransformedImagesElementMode.editor)
                                    }}
                                />
                            )
                            )}
                        </div>
                    </div>
                );

            case TransformedImagesElementMode.selection:
                return (
                    <div
                        className="imageSelection"
                        ref={e => this.selectionList = e}
                    >
                        <div className="list">
                            {this.state.rawImages
                                .map((a, i) => (
                                    <ImageListingTile
                                        image={a}
                                        key={i}
                                        showActions={false}
                                        isSelected={this.state.selectedImages.includes(a)}
                                        onSelect={image => this.selectImage(image)}
                                    />
                                )
                                )}
                        </div>
                        <SelectionButtons
                            onClickCancel={() => {
                                this.revertSelectedImages();
                                this.setMode(TransformedImagesElementMode.listing)
                            }}
                            onClickUpdate={() => { this.setMode(TransformedImagesElementMode.listing) }}
                            onClickLoadMore={() => { this.loadMoreAssets() }}
                            showLoadMore={this.props.moreAssetsQuery !== null}
                        />
                    </div>
                );

            case TransformedImagesElementMode.editor:
                return (
                    <div
                        className="imageEditor"
                        ref={e => this.editorWrapper = e}
                    >
                        <TransformationsEditor
                            editedImage={this.state.editedImage}
                            isPreview={() => this.state.editorUsePreview}
                        />
                        <EditorButtons
                            onClickCancel={() => {
                                this.revertEditedImage();
                                this.setMode(TransformedImagesElementMode.listing)
                            }}
                            onClickUpdate={() => {
                                this.setMode(TransformedImagesElementMode.listing)
                            }}
                            onClickPreview={() => {
                                this.state.editorUsePreview
                                    ? this.setState({ editorUsePreview: false })
                                    : this.setState({ editorUsePreview: true })
                            }}
                            usePreview={this.state.editorUsePreview}
                        />
                    </div>
                );
        }
    }
}