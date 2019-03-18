import * as React from "react";
import { AssetResponses } from "kentico-cloud-content-management";
import { Observable, empty } from "rxjs";

import { IContext } from "../types/customElement/IContext";
import { ICustomElement } from "../types/customElement/ICustomElement";
import { IElementConfig, IRequiredConfig, OPTIONAL_CONFIG } from "../types/customElement/IElementConfig";
import { TransformedImage } from "../types/transformedImage/TransformedImage";
import { Transforms, ITransforms } from "../types/transformedImage/Transforms";

import { ImageListingTile } from "./listing/ImageListingTile";
import { ListingButtons } from "./listing/ListingButtons";
import { SelectionButtons } from "./selection/SelectionButtons";
import { TransformsEditor } from "./editor/TransformsEditor";
import { EditorButtons } from "./editor/EditorButtons";

export enum TransformedImagesElementMode {
    configuration,
    listing,
    selection,
    editor
}

export interface IElementProps {
    context?: IContext;
    initialDisabled: boolean;
    initialRawImages: TransformedImage[];
    initialSelectedImages: TransformedImage[];
    initialMode: TransformedImagesElementMode;
    moreAssetsObservable: Observable<AssetResponses.AssetsListResponse>;
    configurationError?: Error;
}

export interface IElementState {
    disabled: boolean;
    rawImages: TransformedImage[];
    selectedImages: TransformedImage[];
    previousSelectedImages: TransformedImage[];
    editedImage: TransformedImage | null;
    previousEditedTransforms: ITransforms | null;
    mode: TransformedImagesElementMode;
    editorUsePreview: boolean;
    editedImageUrl: string;
}

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export class TransformedImagesElement extends React.Component<IElementProps, IElementState> {
    private configuration: HTMLDivElement | null;
    private selectionList: HTMLDivElement | null;
    private listingList: HTMLDivElement | null;
    private editorWrapper: HTMLDivElement | null;

    state: IElementState = {
        disabled: this.props.initialDisabled,
        rawImages: this.props.initialRawImages,
        selectedImages: this.props.initialSelectedImages,
        previousSelectedImages: [],
        editedImage: null,
        previousEditedTransforms: null,
        mode: this.props.initialMode,
        editorUsePreview: OPTIONAL_CONFIG.editorDefaultToPreview,
        editedImageUrl: ""
    };

    setMode = (mode: TransformedImagesElementMode) => {
        this.setState({
            mode: mode
        },
            this.updateValue
        )
    }

    loadMoreAssets(): void {
        if (this.props.context) {
            const context = this.props.context;

            this.props.moreAssetsObservable
                .subscribe(response =>
                    this.setState(state =>
                        ({
                            rawImages: [
                                ...state.rawImages,
                                ...response.data.items
                                    .filter(i =>
                                        TransformedImage.assetIsImage(i)
                                    )
                                    .map(a =>
                                        new TransformedImage(context.projectId, a)
                                    )
                            ]
                        })
                    ))
        } else {
            throw Error("Context is not available to load more assets.");
        }
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
        const transformsClone = Transforms.clone(image.transforms);

        this.setState({
            editedImage: image,
            previousEditedTransforms: transformsClone
        })
    }

    revertEditedImage() {
        if (this.state.editedImage && this.state.previousEditedTransforms) {
            this.state.editedImage.transforms = this.state.previousEditedTransforms;
        }
    }

    selectImage(image: TransformedImage): any {
        // Deselect image
        if (!!this.state.selectedImages.find(s => s.id === image.id)) {
            this.setState((state) => ({
                selectedImages: state.selectedImages.filter(a => a.id !== image.id)
            }))
        }
        // Select image
        else {
            this.setState((state) => ({
                selectedImages: [...state.selectedImages, image]
            }))
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
        let renderedHeight = 0;

        switch (this.state.mode) {
            case TransformedImagesElementMode.configuration:
                renderedHeight = this.configuration ? this.configuration.scrollHeight : 0;
                break;
            case TransformedImagesElementMode.listing:
                renderedHeight = this.listingList ? this.listingList.scrollHeight : 0;
                break;
            case TransformedImagesElementMode.selection:
                renderedHeight = this.selectionList ? this.selectionList.scrollHeight : 0;
                break;
            case TransformedImagesElementMode.editor:
                renderedHeight = this.editorWrapper ? this.editorWrapper.scrollHeight : 0;
                break;
        }

        if (renderedHeight > 0) {
            CustomElement.setHeight(renderedHeight);
        }
    }

    componentDidMount() {
        CustomElement.onDisabledChanged(disabled =>
            this.setState({ disabled: disabled }));

        this.updateHeight;
    };

    componentDidUpdate = this.updateHeight;

    render() {
        switch (this.state.mode) {
            case TransformedImagesElementMode.configuration:
                const sampleParameters: IRequiredConfig = {
                    contentManagementAPIKey: "<Key value from Project settings > API Keys > Content Management API>",
                    [nameof<IElementConfig>(i => i.editorDefaultToPreview)]: "<Optional: 'true' or 'false' (without quotes) to preview transformations in the editor by default>",
                    [nameof<IElementConfig>(i => i.editorDefaultCropType)]: "<Optional: One of the following default crop modes: 'scale', 'fit', 'frame', 'box', 'zoom'>",
                    [nameof<IElementConfig>(i => i.colorPickerDefaultColors)]: "<Optional: Array of default colors like ['#RRGGBBAA', '#4caf50', ...]>"
                }

                return (
                    <div
                        className="configuration"
                        ref={e => this.configuration = e}
                    >
                        <div className="details">
                            <strong>Error: </strong>
                            {this.props.configurationError ? this.props.configurationError.message : ""}
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
                        {
                            this.state.disabled
                                ? null
                                : <ListingButtons
                                    onClickPick={() => { this.storeCurrentSelectedImages(); this.setMode(TransformedImagesElementMode.selection) }}
                                />
                        }
                        <div className="list">
                            {this.state.selectedImages.map((a, i) => (
                                <ImageListingTile
                                    image={a}
                                    key={i}
                                    showActions={!this.state.disabled}
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
                                        isSelected={!!this.state.selectedImages.find(s => s.id === a.id)}
                                        onSelect={image => this.selectImage(image)}
                                        onAddParams={() => { }}
                                        onRemove={() => { }}
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
                            showLoadMore={this.props.moreAssetsObservable !== empty()}
                        />
                    </div>
                );

            case TransformedImagesElementMode.editor:

                if (this.state.editedImage) {
                    return (
                        <div
                            className="imageEditor"
                            ref={e => this.editorWrapper = e}
                        >
                            <TransformsEditor
                                editedImage={this.state.editedImage}
                                disabled={this.state.disabled}
                                isPreview={this.state.editorUsePreview}
                                updateUrl={url => this.setState({ editedImageUrl: url })}
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
                                disabled={this.state.disabled}
                                editedImageUrl={this.state.editedImageUrl}
                            />

                        </div>
                    );
                } else {
                    throw Error("No edited image found, but editor is open.");
                }
        }
    }
}