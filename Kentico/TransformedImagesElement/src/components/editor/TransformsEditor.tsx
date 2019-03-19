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

    editorIsSet = false;

    get mode(): EditorMode {
        return this.props.isPreview
            ? this.state
                ? this.state.mode
                : EditorMode.preview
            : EditorMode.noPreview;
    }

    set mode(mode: EditorMode) {
        this.setState({ mode: mode });
    }

    getImageUrl(): string {
        switch (this.mode) {
            case EditorMode.preview:
                return this.props.editedImage.buildEditedUrl().getUrl();
            case EditorMode.hovering:
                return this.props.editedImage.buildHoverUrl().getUrl();
            case EditorMode.noPreview:
                return this.props.editedImage.buildUrl().getUrl();
        }
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
                                src={this.getImageUrl()}
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
                                currentEditor={currentEditor as any}
                                setCurrentEditor={editor => {
                                    this.setState({ currentEditor: editor })
                                }}
                                transform={transforms.crop}
                                setTransform={() => this.update()}
                                imageWidth={imageWidth ? imageWidth : 0}
                                imageHeight={imageHeight ? imageHeight : 0}
                            />
                            <BackgroundControls
                                currentEditor={currentEditor as any}
                                setCurrentEditor={editor => {
                                    this.setState({ currentEditor: editor })
                                }}
                                transform={transforms.background}
                                setTransform={() => this.update()}
                            />
                            <FormatControls
                                currentEditor={currentEditor as any}
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