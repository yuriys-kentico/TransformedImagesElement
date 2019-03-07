import * as React from "react";

import { IContext } from "../../types/customElement/IContext";
import { BaseControls } from "../../types/editor/BaseControls";
import { TransformedImage } from "../../types/transformedImage/TransformedImage";

import { ResizeControls } from "./controls/ResizeControls";
import { BackgroundControls } from "./controls/BackgroundControls";

export interface IImageEditorProps {
    image: TransformedImage;
    context: IContext;
    usePreview: boolean;
}

export interface IImageEditorState {
    currentEditor: BaseControls;
}

export class ImageEditor extends React.Component<IImageEditorProps, IImageEditorState> {
    state: IImageEditorState = {
        currentEditor: null
    }

    getPreviewImageUrl(item: TransformedImage): string {
        if (this.props.usePreview) {
            return item.getImageUrl();
        } else {
            return item.buildUrl()
                .withWidth(1000)
                .withHeight(1000)
                .getUrl();
        }
    }

    render() {
        let currentEditor = this.state.currentEditor;

        return (
            <div className="editor">
                <div className="imageEditorPreview" >
                    <span className="imageWrapper">
                        <div
                            className="imageMask"
                            onMouseDown={e => {
                                if (this.state.currentEditor.onMouseDown(e))
                                    this.forceUpdate()
                            }}
                            onMouseMove={e => {
                                if (this.state.currentEditor.onMouseMove(e))
                                    this.forceUpdate()
                            }}
                            onMouseUp={e => {
                                if (this.state.currentEditor.onMouseUp(e))
                                    this.forceUpdate()
                            }}
                        >
                            {this.state.currentEditor ? this.state.currentEditor.getImageOverlay() : null}
                        </div>
                        <img
                            className="imageEditorImage"
                            src={this.getPreviewImageUrl(this.props.image)}
                        />
                    </span>
                </div>
                <div className="editorControls" >
                    <ResizeControls
                        getCurrentEditor={() => currentEditor}
                        setCurrentEditor={editor => {
                            currentEditor = editor;
                            this.setState({ currentEditor: editor })
                        }}
                        imageWidth={this.props.image.imageWidth}
                        imageHeight={this.props.image.imageHeight}
                        setResizeType={type => {
                            this.props.image.transformations.resize.type = type;
                            this.forceUpdate(() => this.forceUpdate());
                        }}
                        setResizeHeight={height => {
                            this.props.image.transformations.resize.height = height;
                            this.forceUpdate(() => this.forceUpdate());
                        }}
                        setResizeWidth={width => {
                            this.props.image.transformations.resize.width = width;
                            this.forceUpdate(() => this.forceUpdate());
                        }}
                        setResizeDpr={dpr => {
                            this.props.image.transformations.resize.devicePixelRatio = dpr;
                            this.forceUpdate(() => this.forceUpdate());
                        }}
                        {...this.props.image.transformations.resize}
                    />
                    <BackgroundControls
                        getCurrentEditor={() => currentEditor}
                        setCurrentEditor={editor => {
                            currentEditor = editor;
                            this.setState({ currentEditor: editor })
                        }}
                        setBackgroundColor={color => {
                            this.props.image.transformations.background.color = color;
                            this.forceUpdate(() => this.forceUpdate());
                        }}
                        {...this.props.image.transformations.background}
                    />
                </div>
            </div >
        );
    }
}