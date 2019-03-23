import * as React from "react";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";
import { Checkerboard } from "../../types/editor/Checkerboard";

import { BaseControls } from "./controls/BaseControls";
import { BackgroundControls } from "./controls/BackgroundControls";
import { CropControls } from "./controls/CropControls";
import { FormatControls } from "./controls/FormatControls";
import { ResizeControls } from "./controls/ResizeControls";
import { If } from "../If";
import { CropType } from "../../types/transformedImage/Transforms";

enum EditorMode {
    editing,
    preview,
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
        if (this.state && this.state.mode === EditorMode.editing) {
            return EditorMode.editing;
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

    private isEditing(): boolean {
        return this.mode === EditorMode.editing;
    }

    private isPreview(): boolean {
        return this.mode === EditorMode.preview;
    }

    private isNoPreview(): boolean {
        return this.mode === EditorMode.noPreview;
    }

    private getHoveringClass(): string {
        switch (this.mode) {
            case EditorMode.preview:
                return this.props.disabled
                    ? "preview"
                    : "edit preview";
            case EditorMode.editing:
            case EditorMode.noPreview:
                return "scaleToFit";
        }
    }

    private updateMouseAction(event: React.MouseEvent<HTMLDivElement, MouseEvent>, action: MouseAction, currentEditor: BaseControls | null) {
        if (currentEditor) {
            switch (action) {
                case MouseAction.down:
                    if (event.button !== 2 && !this.mouseIsDown && currentEditor.setActionParams(event)) {
                        this.mouseIsDown = true;
                        this.update();
                    }
                    break;
                case MouseAction.move:
                    if (this.mouseIsDown && currentEditor.updateActionParams(event)) {
                        this.update();
                    }
                    this.mode = EditorMode.editing;
                    break;
                case MouseAction.leave:
                    if (this.mouseIsDown && currentEditor.updateTransform(event)) {
                        this.mouseIsDown = false;
                        this.update();
                    }
                    this.props.disabled
                        ? this.mode = EditorMode.editing
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
        this.props.updateUrl(this.props.editedImage.buildPreviewUrl().getUrl());
        this.forceUpdate();
    }

    componentDidMount() {
        this.props.updateUrl(this.props.editedImage.buildPreviewUrl().getUrl());

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
                    onMouseDown={e => this.updateMouseAction(e, MouseAction.down, currentEditor)}
                    onMouseMove={e => this.updateMouseAction(e, MouseAction.move, currentEditor)}
                    onMouseUp={e => this.updateMouseAction(e, MouseAction.up, currentEditor)}
                    onMouseLeave={e => this.updateMouseAction(e, MouseAction.leave, currentEditor)}
                >
                    <span className="imageWrapper">
                        <div className="imageMask">
                            <If shouldRender={this.isEditing()}>
                                {currentEditor ? currentEditor.getImageOverlay() : null}
                            </If>
                            <If shouldRender={!(this.state.currentEditor instanceof ResizeControls)}>
                                <img
                                    id="a"
                                    className="imageEditorImage"
                                    hidden={!this.isEditing()}
                                    src={this.props.editedImage.buildEditingUrl().getUrl()}
                                />

                            </If>
                            <If shouldRender={this.state.currentEditor instanceof ResizeControls}>
                                <img
                                    id="b"
                                    className="imageEditorImage"
                                    hidden={!this.isEditing()}
                                    src={this.props.editedImage.buildCropUrl().getUrl()}
                                />
                            </If>
                            <img
                                id="c"
                                className="imageEditorImage"
                                hidden={!this.isPreview()}
                                src={this.props.editedImage.buildPreviewUrl().getUrl()}
                            />
                            <img
                                id="d"
                                className="imageEditorImage"
                                hidden={!this.isNoPreview()}
                                src={this.props.editedImage.buildEditingUrl().getUrl()}
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
                            imageWidth={imageWidth}
                            imageHeight={imageHeight}
                        />
                        <If shouldRender={transforms.crop.type !== CropType.zoom}>
                            <ResizeControls
                                isCurrentEditor={this.editorIsCurrent}
                                setCurrentEditor={this.setCurrentEditor}
                                transform={transforms.resize}
                                setTransform={this.update}
                                imageWidth={imageWidth}
                                imageHeight={imageHeight}
                            />
                        </If>
                        <If shouldRender={this.props.editedImage.canBeTransparent()}>
                            <BackgroundControls
                                isCurrentEditor={this.editorIsCurrent}
                                setCurrentEditor={this.setCurrentEditor}
                                transform={transforms.background}
                                setTransform={this.update}
                                imageWidth={imageWidth}
                                imageHeight={imageHeight}
                            />
                        </If>
                        <FormatControls
                            isCurrentEditor={this.editorIsCurrent}
                            setCurrentEditor={this.setCurrentEditor}
                            transform={transforms.format}
                            setTransform={this.update}
                            imageWidth={imageWidth}
                            imageHeight={imageHeight}
                        />
                    </div>
                </If>
            </div >
        );
    }
}