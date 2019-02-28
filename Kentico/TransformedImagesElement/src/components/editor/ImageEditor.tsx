import * as React from "react";

import { IContext } from "../../types/kentico/IContext";
import { TransformedImage } from "../../types/TransformedImage";
import { ImageEditorMode } from "../../types/ImageEditorMode";

export interface IImageEditorProps {
    image: TransformedImage;
    context: IContext;
}

export interface IImageEditorState {
    mode: ImageEditorMode;
    startPoint: DOMPoint;
    endPoint: DOMPoint;
}

export class ImageEditor extends React.Component<IImageEditorProps, IImageEditorState> {
    getImageUrl(item: TransformedImage): string {
        if (item) {
            return item.buildUrl()
                .withWidth(1000)
                .withHeight(1000)
                .getUrl();
        }
    }

    state: IImageEditorState = {
        mode: ImageEditorMode.unset,
        startPoint: new DOMPoint(0, 0),
        endPoint: new DOMPoint(0, 0)
    };

    getMousePointFromEvent(e: React.MouseEvent<HTMLImageElement, MouseEvent>): DOMPoint {
        const target = e.target as HTMLImageElement;
        const targetRect = target.getBoundingClientRect() as DOMRect;

        return new DOMPoint(e.clientX - targetRect.x, e.clientY - targetRect.y);
    }

    onMouseDown(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        this.setState({
            mode: ImageEditorMode.selecting,
            startPoint: this.getMousePointFromEvent(e),
            endPoint: new DOMPoint(0, 0)
        });
    }

    onMouseMove(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        switch (this.state.mode) {
            case ImageEditorMode.selecting:
                this.setState({
                    endPoint: this.getMousePointFromEvent(e)
                });
        }
    }

    onMouseUp(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        this.setState({
            mode: ImageEditorMode.unset,
            endPoint: this.getMousePointFromEvent(e)
        });
    }

    render() {
        return (
            <div className="editor">
                <div
                    className="imageEditorPreview"
                >
                    <span className="imageWrapper">
                        <div
                            className="cropBox"
                            style={{
                                left: this.state.startPoint.x,
                                top: this.state.startPoint.y,
                                width: this.state.endPoint.x - this.state.startPoint.x,
                                height: this.state.endPoint.y - this.state.startPoint.y
                            }}
                        />
                        <div
                            className="imageMask"
                            onMouseDown={e => this.onMouseDown(e)}
                            onMouseMove={e => this.onMouseMove(e)}
                            onMouseUp={e => this.onMouseUp(e)}
                        />
                        <img
                            className="imageEditorImage"
                            src={this.getImageUrl(this.props.image)}
                        />
                    </span>
                </div>
                <div className="editorControls">
                    Controls coming soon!
                </div>
            </div>
        );
    }
}