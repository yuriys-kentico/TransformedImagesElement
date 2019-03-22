import * as React from "react";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";
import { Checkerboard } from "../../types/editor/Checkerboard";

import { BaseControls } from "./controls/BaseControls";
import { BackgroundControls } from "./controls/BackgroundControls";
import { CropControls } from "./controls/CropControls";
import { FormatControls } from "./controls/FormatControls";
import { ResizeControls } from "./controls/ResizeControls";
import { If } from "../If";

enum EditorMode {
    preview,
    hovering,
    noPreview
}

enum MouseAction {
    up,
    down,
    move,
    leave
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

    private firstEditor: BaseControls | null;

    mouseIsDown: boolean;

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

    private editorIsCurrent = (editor: BaseControls): boolean => {
        return editor === this.state.currentEditor;
    }

    private setCurrentEditor = (editor: BaseControls) => {
        this.setState({ currentEditor: editor });
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

    updateMouseAction(event: React.MouseEvent<HTMLDivElement, MouseEvent>, action: MouseAction, currentEditor: BaseControls | null) {
        if (currentEditor) {
            switch (action) {
                case MouseAction.down:
                    if (event.button !== 2 && !this.mouseIsDown && currentEditor.onMouseDown(event)) {
                        this.mouseIsDown = true;
                        this.update();
                    }
                    break;
                case MouseAction.move:
                    if (this.mouseIsDown && currentEditor.onMouseMove(event)) {
                        this.update();
                    }
                    break;
                case MouseAction.leave:
                    if (this.mouseIsDown && currentEditor.updateTransform(event)) {
                        this.mouseIsDown = false;
                        this.update();
                    }
                    this.props.disabled
                        ? this.mode = EditorMode.hovering
                        : this.mode = EditorMode.preview;
                    break;
                case MouseAction.up:
                    if (event.button !== 2 && this.mouseIsDown && currentEditor.updateTransform(event)) {
                        this.mouseIsDown = false;
                        this.update();
                    }
                    break;
            }
        }
    }

    update = (): void => {
        this.props.updateUrl(this.props.editedImage.buildEditedUrl().getUrl());
        this.forceUpdate();
    }

    componentDidMount() {
        this.props.updateUrl(this.props.editedImage.buildEditedUrl().getUrl());

        if (this.firstEditor) {
            this.setState({
                currentEditor: this.firstEditor
            });
        }
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
                    onMouseLeave={e => this.updateMouseAction(e, MouseAction.leave, currentEditor)}
                    onMouseMove={() => this.mode = EditorMode.hovering}
                >
                    <span className="imageWrapper">
                        <div
                            className="imageMask"
                            onMouseDown={e => this.updateMouseAction(e, MouseAction.down, currentEditor)}
                            onMouseUp={e => this.updateMouseAction(e, MouseAction.up, currentEditor)}
                            onMouseMove={e => this.updateMouseAction(e, MouseAction.move, currentEditor)}
                        >
                            <If shouldRender={this.mode !== EditorMode.preview}>
                                {currentEditor ? currentEditor.getImageOverlay() : null}
                            </If>
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
                <If shouldRender={!this.props.disabled}>
                    <div
                        className="editorControls"
                        onClick={() => {
                            if (currentEditor) {
                                currentEditor.onClickSidebar();
                            }
                        }}
                    >
                        <CropControls
                            ref={e => this.firstEditor = e}
                            isCurrentEditor={this.editorIsCurrent}
                            setCurrentEditor={this.setCurrentEditor}
                            transform={transforms.crop}
                            setTransform={this.update}
                            imageWidth={imageWidth ? imageWidth : 0}
                            imageHeight={imageHeight ? imageHeight : 0}
                        />
                        <ResizeControls
                            isCurrentEditor={this.editorIsCurrent}
                            setCurrentEditor={this.setCurrentEditor}
                            transform={transforms.resize}
                            setTransform={this.update}
                            imageWidth={imageWidth ? imageWidth : 0}
                            imageHeight={imageHeight ? imageHeight : 0}
                        />
                        <If shouldRender={this.props.editedImage.canBeTransparent()}>
                            <BackgroundControls
                                isCurrentEditor={this.editorIsCurrent}
                                setCurrentEditor={this.setCurrentEditor}
                                transform={transforms.background}
                                setTransform={this.update}
                            />
                        </If>
                        <FormatControls
                            isCurrentEditor={this.editorIsCurrent}
                            setCurrentEditor={this.setCurrentEditor}
                            transform={transforms.format}
                            setTransform={this.update}
                        />
                    </div>
                </If>
            </div >
        );
    }
}