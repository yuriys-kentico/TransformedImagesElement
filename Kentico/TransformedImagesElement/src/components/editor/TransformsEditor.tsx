import * as React from "react";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";
import { Checkerboard } from "../../types/editor/Checkerboard";

import { BaseControls } from "./controls/BaseControls";
import { BackgroundControls, IBackgroundControlsProps } from "./controls/BackgroundControls";
import { CropControls, ICropControlsProps } from "./controls/CropControls";
import { FormatControls, IFormatControlsProps } from "./controls/FormatControls";

export enum EditorMode {
    preview,
    hovering,
    noPreview
}

export interface IImageEditorProps {
    editedImage: TransformedImage;
    isPreview: () => boolean;
    updateUrl: (url: string) => void;
}

export interface IImageEditorState {
    currentEditor: BaseControls;
    mode: EditorMode;
}

export class TransformsEditor extends React.Component<IImageEditorProps, IImageEditorState> {
    state: IImageEditorState = {
        currentEditor: null,
        mode: this.getMode()
    }

    getMode(): EditorMode {
        return this.props.isPreview()
            ? this.state
                ? this.state.mode
                : EditorMode.preview
            : EditorMode.noPreview;
    }

    setMode = (mode: EditorMode) => {
        this.setState({ mode: mode })
    }

    getImageUrl(): string {
        switch (this.getMode()) {
            case EditorMode.preview:
                return this.props.editedImage.buildEditedUrl().getUrl();
            case EditorMode.hovering:
                return this.props.editedImage.buildHoverUrl().getUrl();
            case EditorMode.noPreview:
                return this.props.editedImage.buildUrl().getUrl();
        }
    }

    getHoveringClass(): string {
        switch (this.getMode()) {
            case EditorMode.preview:
                return "preview";
            case EditorMode.hovering:
                return "scaleToFit";
            case EditorMode.noPreview:
                return "";
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
        const transforms = this.props.editedImage.transforms;

        return (
            <div
                className="editor"
                style={{
                    background: `url(${Checkerboard.generate("transparent", "rgba(0,0,0,.02)", 16)}) center left`
                }}
            >
                <div
                    className={`imageEditorPreview ${this.getHoveringClass()}`}
                    onMouseEnter={() => this.setMode(EditorMode.hovering)}
                    onMouseLeave={() => this.setMode(EditorMode.preview)}
                >
                    <span className="imageWrapper">
                        <div
                            className="imageMask"
                            onMouseDown={e => {
                                if (this.state.currentEditor.onMouseDown(e))
                                    this.update()
                            }}
                            onMouseMove={e => {
                                if (this.state.currentEditor.onMouseMove(e))
                                    this.update()
                            }}
                            onMouseUp={e => {
                                if (this.state.currentEditor.onMouseUp(e))
                                    this.update()
                            }}
                        >
                            {this.state.currentEditor
                                ? this.state.currentEditor.getImageOverlay()
                                : null
                            }
                        </div>
                        <img
                            className="imageEditorImage"
                            src={this.getImageUrl()}
                        />
                    </span>
                </div>
                <div
                    className="editorControls"
                    onClick={e => {
                        this.state.currentEditor.onClickSidebar();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
                >
                    <CropControls
                        getCurrentEditor={currentEditor as BaseControls<ICropControlsProps>}
                        setCurrentEditor={editor => {
                            this.setState({ currentEditor: editor })
                        }}
                        getTransform={transforms.crop}
                        onSetTransform={() => this.update()}
                        imageWidth={this.props.editedImage.imageWidth}
                        imageHeight={this.props.editedImage.imageHeight}
                    />
                    <BackgroundControls
                        getCurrentEditor={currentEditor as BaseControls<IBackgroundControlsProps>}
                        setCurrentEditor={editor => {
                            this.setState({ currentEditor: editor })
                        }}
                        getTransform={transforms.background}
                        onSetTransform={() => this.update()}
                    />
                    <FormatControls
                        getCurrentEditor={currentEditor as BaseControls<IFormatControlsProps>}
                        setCurrentEditor={editor => {
                            this.setState({ currentEditor: editor })
                        }}
                        getTransform={transforms.format}
                        onSetTransform={() => this.update()}
                    />
                </div>
            </div >
        );
    }
}