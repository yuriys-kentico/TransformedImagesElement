import * as React from "react";

import { IContext } from "../types/customElement/IContext";
import { ICustomElement, AssetFileTypes } from "../types/customElement/ICustomElement";
import { OPTIONAL_CONFIG } from "../types/customElement/IElementConfig";
import { TransformedImage } from "../types/transformedImage/TransformedImage";
import { Transforms, ITransforms } from "../types/transformedImage/Transforms";

import { ImageListingTile } from "./listing/ImageListingTile";
import { ListingButtons } from "./listing/ListingButtons";
import { TransformsEditor } from "./editor/TransformsEditor";
import { EditorButtons } from "./editor/EditorButtons";
import { If } from "./If";

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export enum TransformedImagesElementMode {
    configuration,
    listing,
    editor
}

export interface IElementProps {
    context: IContext;
    initialDisabled: boolean;
    initialSelectedImages: TransformedImage[];
    initialMode: TransformedImagesElementMode;
}

export interface IElementState {
    disabled: boolean;
    selectedImages: TransformedImage[];
    previousSelectedImages: TransformedImage[];
    editedImage: TransformedImage | null;
    previousEditedTransforms: ITransforms | null;
    mode: TransformedImagesElementMode;
    editorUsePreview: boolean;
    editedImageUrl: string;
}

export class TransformedImagesElement extends React.Component<IElementProps, IElementState> {
    private listingList: HTMLDivElement | null;
    private editorWrapper: HTMLDivElement | null;

    state: IElementState = {
        disabled: this.props.initialDisabled,
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

    selectForEditing(image: TransformedImage) {
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

    selectAssets(assets: TransformedImage[]) {
        this.setState(state=>({
            selectedImages: [...state.selectedImages, ...assets]
        }), this.updateValue)
    }

    removeAsset(index: number) {
        this.setState((state=> {
            let array = [...state.selectedImages];
            array.splice(index,1);

            return {
                selectedImages: array,
            }
        }), this.updateValue)
        // if (!!this.state.selectedImages.find(i => i === asset)) {
        //     this.setState((state) => ({
        //         selectedImages: state.selectedImages.filter(i => i.id !== asset.id)
        //     }), this.updateValue)
        // }
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
            case TransformedImagesElementMode.listing:
                renderedHeight = this.listingList ? this.listingList.scrollHeight : 0;
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

        this.updateHeight();
    };

    componentDidUpdate = this.updateHeight;

    render() {
        switch (this.state.mode) {
            case TransformedImagesElementMode.listing:
                return (
                    <div
                        className="imageListing"
                        ref={e => this.listingList = e}
                    >
                        <If shouldRender={!this.state.disabled}>
                            <ListingButtons
                                onClickPick={() => {
                                    this.storeCurrentSelectedImages();

                                    CustomElement.selectAssets({ allowMultiple: true, fileType: AssetFileTypes.images }).then(assets=>{
                                        CustomElement.getAssetDetails(assets.map(a=>a.id)).then(assets=>{
                                            this.selectAssets(assets.map(a=>new TransformedImage(a)));
                                        });
                                    })
                                }}
                            />
                        </If>
                        <div className="list">
                            {this.state.selectedImages.map((a, i) => (
                                <ImageListingTile
                                    image={a}
                                    key={i}
                                    showActions={!this.state.disabled}
                                    isSelected={false}
                                    onRemove={_image => {
                                        this.removeAsset(i);
                                    }}
                                    onSelect={image=>{
                                        this.selectForEditing(image);
                                        this.setMode(TransformedImagesElementMode.editor);
                                    }}
                                    onAddParams={asset=>{
                                        this.selectForEditing(asset);
                                        this.setMode(TransformedImagesElementMode.editor);
                                    }}
                                />
                            )
                            )}
                        </div>
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
                                isDisabled={this.state.disabled}
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