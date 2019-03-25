import * as React from "react";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";
import { Checkerboard } from "../../types/editor/Checkerboard";
import { CropType } from "../../types/transformedImage/Transforms";

import { BaseControls } from "./controls/BaseControls";
import { BackgroundControls } from "./controls/BackgroundControls";
import { CropControls } from "./controls/CropControls";
import { FormatControls } from "./controls/FormatControls";
import { ResizeControls } from "./controls/ResizeControls";
import { If } from "../If";

enum EditorMode {
    editing,
    preview,
    noPreview
}

export interface IImageEditorProps {
    editedImage: TransformedImage;
    isDisabled: boolean;
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

    private mouseIsDown: boolean;

    private mouseActionZone: HTMLDivElement | null;

    private firstEditor: BaseControls | null;

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

    update = (): void => {
        this.props.updateUrl(this.props.editedImage.buildPreviewUrl().getUrl());
        this.forceUpdate();
    }

    componentDidMount() {
        this.props.updateUrl(this.props.editedImage.buildPreviewUrl().getUrl());

        if (this.mouseActionZone) {
            fromEvent<React.MouseEvent<HTMLDivElement>>(this.mouseActionZone, "mousedown")
                .subscribe(event => {
                    if (event.button !== 2
                        && !this.mouseIsDown
                        && this.state.currentEditor
                        && this.state.currentEditor.setActionParams(event)) {
                        this.mouseIsDown = true;
                        this.update();
                    }
                });

            fromEvent<React.MouseEvent<HTMLDivElement>>(this.mouseActionZone, "mousemove")
                .pipe(throttleTime(10))
                .subscribe(event => {
                    if (this.mouseIsDown
                        && this.state.currentEditor
                        && this.state.currentEditor.updateActionParams(event)) {
                        this.update();
                    }
                    if (!this.props.isDisabled) {
                        this.mode = EditorMode.editing;
                    }
                });

            fromEvent<React.MouseEvent<HTMLDivElement>>(this.mouseActionZone, "mouseup")
                .subscribe(event => {
                    if (event.button !== 2
                        && this.mouseIsDown
                        && this.state.currentEditor
                        && this.state.currentEditor.updateTransform(event)) {
                        this.mouseIsDown = false;
                        this.update();
                    }
                });

            fromEvent<React.MouseEvent<HTMLDivElement>>(this.mouseActionZone, "mouseleave")
                .subscribe(event => {
                    if (this.mouseIsDown
                        && this.state.currentEditor
                        && this.state.currentEditor.updateTransform(event)) {
                        this.mouseIsDown = false;
                        this.update();
                    }
                    this.mode = this.props.isPreview
                        ? EditorMode.preview
                        : EditorMode.noPreview;
                });
        }

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
                    className="imageEditorPreview"
                    ref={e => this.mouseActionZone = e}
                >
                    <div className="imageWrapper">
                        <span className="imageMask">
                            <If shouldRender={this.isEditing()}>
                                {currentEditor ? currentEditor.getImageOverlay() : null}
                            </If>
                            <If shouldRender={!(this.state.currentEditor instanceof ResizeControls)}>
                                <img
                                    className="imageEditorImage"
                                    hidden={!this.isEditing()}
                                    src={this.props.editedImage.buildEditingUrl().getUrl()}
                                />
                            </If>
                            <If shouldRender={this.state.currentEditor instanceof ResizeControls}>
                                <img
                                    className="imageEditorImage"
                                    hidden={!this.isEditing()}
                                    src={this.props.editedImage.buildCropUrl().getUrl()}
                                />
                            </If>
                            <img
                                className="imageEditorImage"
                                hidden={!this.isPreview()}
                                src={this.props.editedImage.buildPreviewUrl().getUrl()}
                            />
                            <img
                                className="imageEditorImage"
                                hidden={!this.isNoPreview()}
                                src={this.props.editedImage.buildEditingUrl().getUrl()}
                            />
                        </span>
                    </div>
                    <If shouldRender={!this.isEditing() && !this.props.isDisabled}>
                        <span className="hoverToEdit">
                            (Hover to edit)
                        </span>
                    </If>
                </div>
                <If shouldRender={!this.props.isDisabled}>
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
                            isEditable={true}
                            imageWidth={imageWidth}
                            imageHeight={imageHeight}
                        />
                        <If shouldRender={transforms.crop.type !== CropType.zoom}>
                            <ResizeControls
                                isCurrentEditor={this.editorIsCurrent}
                                setCurrentEditor={this.setCurrentEditor}
                                transform={transforms.resize}
                                setTransform={this.update}
                                isEditable={true}
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
                                isEditable={false}
                                imageWidth={imageWidth}
                                imageHeight={imageHeight}
                            />
                        </If>
                        <FormatControls
                            isCurrentEditor={this.editorIsCurrent}
                            setCurrentEditor={() => null}
                            transform={transforms.format}
                            setTransform={this.update}
                            isEditable={false}
                            imageWidth={imageWidth}
                            imageHeight={imageHeight}
                        />
                    </div>
                </If>
            </div >
        );
    }
}