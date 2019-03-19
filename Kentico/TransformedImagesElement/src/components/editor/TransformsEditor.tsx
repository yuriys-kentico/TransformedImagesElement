import * as React from "react";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";
import { Checkerboard } from "../../types/editor/Checkerboard";

import { BaseControls } from "./controls/BaseControls";
import { BackgroundControls } from "./controls/BackgroundControls";
import { CropControls } from "./controls/CropControls";
import { FormatControls } from "./controls/FormatControls";

export enum EditorMode {
    preview,
    hovering,
    noPreview
}

export interface IImageEditorProps {
    editedImage: TransformedImage;
    disabled: boolean;
    isPreview: boolean;
    updateUrl: (url: string) => void;
}

export interface IImageEditorState {
    currentEditor: BaseControls | null;
    mode: EditorMode;
}

export class TransformsEditor extends React.Component<IImageEditorProps, IImageEditorState> {
    state: IImageEditorState = {
        currentEditor: null,
        mode: this.mode
    }

    private firstEditor: CropControls | null;

    get mode(): EditorMode {
        if (this.state && this.state.mode === EditorMode.hovering) {
            return EditorMode.hovering;
        }

        return this.props.isPreview
            ? EditorMode.preview
            : EditorMode.noPreview;
    }

    set mode(mode: EditorMode) {
        this.setState({ mode: mode });
    }

    isPreviewImageHidden(): boolean {
        switch (this.mode) {
            case EditorMode.hovering:
            case EditorMode.noPreview:
                return true;
        }
        return false;
    }

    isEditImageHidden(): boolean {
        switch (this.mode) {
            case EditorMode.preview:
            case EditorMode.noPreview:
                return true;
        }
        return false;
    }

    isOriginalImageHidden(): boolean {
        switch (this.mode) {
            case EditorMode.preview:
            case EditorMode.hovering:
                return true;
        }
        return false;
    }

    getHoveringClass(): string {
        switch (this.mode) {
            case EditorMode.preview:
                return this.props.disabled
                    ? "preview"
                    : "edit preview";
            case EditorMode.hovering:
            case EditorMode.noPreview:
                return "scaleToFit";
        }
    }

    update(): void {
        this.props.updateUrl(this.props.editedImage.buildEditedUrl().getUrl());
        this.forceUpdate();
    }

    componentDidMount() {
        this.props.updateUrl(this.props.editedImage.buildEditedUrl().getUrl());

        this.setState({
            currentEditor: this.firstEditor
        });
    }

    render() {
        let currentEditor = this.state.currentEditor;
        const { transforms, imageWidth, imageHeight } = this.props.editedImage;

        return (
            <div
                className="editor"
                style={{
                    background: `url(${Checkerboard.generate("transparent", "rgba(0,0,0,.04)", 16)}) center left`
                }}
            >
                <div
                    className={`imageEditorPreview ${this.getHoveringClass()}`}
                    onMouseMove={() => this.props.disabled
                        ? this.mode = EditorMode.preview
                        : this.mode = EditorMode.hovering}
                    onMouseLeave={() => this.props.disabled
                        ? this.mode = EditorMode.preview
                        : this.mode = EditorMode.preview}
                >
                    <span className="imageWrapper">
                        <div
                            className="imageMask"
                            onMouseDown={e => {
                                if (currentEditor && currentEditor.onMouseDown(e))
                                    this.update()
                            }}
                            onMouseMove={e => {
                                if (currentEditor && currentEditor.onMouseMove(e))
                                    this.update()
                            }}
                            onMouseUp={e => {
                                if (currentEditor && currentEditor.onMouseUp(e))
                                    this.update()
                            }}
                            onMouseOut={e => {
                                if (currentEditor && currentEditor.onMouseUp(e))
                                    this.update()
                            }}
                        >
                            {currentEditor
                                && this.mode !== EditorMode.preview
                                ? currentEditor.getImageOverlay()
                                : null
                            }
                            <img
                                className="imageEditorImage"
                                hidden={this.isEditImageHidden()}
                                src={this.props.editedImage.buildHoverUrl().getUrl()}
                            />
                            <img
                                className="imageEditorImage"
                                hidden={this.isPreviewImageHidden()}
                                src={this.props.editedImage.buildEditedUrl().getUrl()}
                            />
                            <img
                                className="imageEditorImage"
                                hidden={this.isOriginalImageHidden()}
                                src={this.props.editedImage.buildUrl().getUrl()}
                            />
                        </div>
                    </span>
                </div>
                {
                    this.props.disabled
                        ? null
                        : <div
                            className="editorControls"
                            onClick={e => {
                                if (currentEditor) {
                                    currentEditor.onClickSidebar();
                                }

                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}
                        >
                            <CropControls
                                ref={e => this.firstEditor = e}
                                isCurrentEditor={editor => editor === currentEditor}
                                setCurrentEditor={editor => {
                                    this.setState({ currentEditor: editor })
                                }}
                                transform={transforms.crop}
                                setTransform={() => this.update()}
                                imageWidth={imageWidth ? imageWidth : 0}
                                imageHeight={imageHeight ? imageHeight : 0}
                            />
                            <BackgroundControls
                                isCurrentEditor={editor => editor === currentEditor}
                                setCurrentEditor={editor => {
                                    this.setState({ currentEditor: editor })
                                }}
                                transform={transforms.background}
                                setTransform={() => this.update()}
                            />
                            <FormatControls
                                isCurrentEditor={editor => editor === currentEditor}
                                setCurrentEditor={editor => {
                                    this.setState({ currentEditor: editor })
                                }}
                                transform={transforms.format}
                                setTransform={() => this.update()}
                            />
                        </div>
                }
            </div >
        );
    }
}