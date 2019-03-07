import * as React from "react";
import { Color } from "csstype";

import { BaseControls, IBaseControlsProps } from "../../../types/editor/BaseControls";
import { IBackgroundTransformation } from "../../../types/transformedImage/IImageTransformations";

import { ColorInput } from "../inputs/ColorInput";

export interface IBackgroundControlsControlsProps extends IBackgroundTransformation, IBaseControlsProps {
    setBackgroundColor(color: Color): void;
}

export class BackgroundControls extends BaseControls<IBackgroundControlsControlsProps> {
    onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
        return false;
    }

    onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
        return false;
    }

    onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
        return false;
    }

    getImageOverlay() {
        return (
            <div>
            </div>
        );
    }

    render() {
        return (
            <div
                className={`control ${this.getCurrentClass()}`}
                onClick={() => this.props.setCurrentEditor(this)}
            >
                <div className="fields">
                    <ColorInput
                        value={this.props.color || "#000000"}
                        tooltip="Background color"
                        onChange={value => this.props.setBackgroundColor(value)}
                    />
                </div>
            </div>
        );
    }
}