import * as React from "react";

import { NumberUtils } from "../../../types/NumberUtils";
import { NumberInputType } from "../inputs/NumberInput";
import { OPTIONAL_CONFIG } from "../../../types/customElement/IElementConfig";

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ActionParams {
    startXFloat: number;
    startYFloat: number;
    endXFloat: number;
    endYFloat: number;
    action: EditAction | string
}

export enum EditAction {
    none = "none",
    selecting = "selecting",
    dragging = "dragging",
    top = "top",
    topRight = "topRight",
    right = "right",
    bottomRight = "bottomRight",
    bottom = "bottom",
    bottomLeft = "bottomleft",
    left = "left",
    topLeft = "topLeft"
}


export interface IBaseControlsProps<TTransform> {
    isCurrentEditor(editor: BaseControls<this, TTransform>): boolean;
    setCurrentEditor(editor: BaseControls<this, TTransform>): void;
    transform: TTransform;
    setTransform: (transform: TTransform) => void;
}

export abstract class BaseControls<IProps extends IBaseControlsProps<TTransform> = IBaseControlsProps<any>, TTransform = {}, IState = {}> extends React.Component<IProps, IState> {
    protected buttonIsSelectedClass(comparison: boolean): string {
        return comparison ? "btn--primary" : "btn--secondary";
    }

    protected defaultNumberType = OPTIONAL_CONFIG.inputsDefaultToPercent
        ? NumberInputType.percent
        : NumberInputType.pixel;

    protected allowedNumberTypes = [NumberInputType.pixel, NumberInputType.percent];

    protected hasMovedMouse(): boolean {
        return Math.abs(this.actionParams.endXFloat - this.actionParams.startXFloat) > 0
            || Math.abs(this.actionParams.endYFloat - this.actionParams.startYFloat) > 0
    }

    protected actionParams: ActionParams = {
        startXFloat: 0,
        startYFloat: 0,
        endXFloat: 0,
        endYFloat: 0,
        action: EditAction.none,
    };

    protected setTransform<K extends keyof TTransform>(
        transform: (Pick<TTransform, K> | TTransform | null)
    ): void {
        const prevTransform = this.props.transform;

        Object.assign(
            prevTransform,
            transform
        );

        this.props.setTransform(prevTransform);
    }

    protected getMouseXY(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const mouseXFloat = NumberUtils.toRounded((mouseX - left) / width, 4);
        const mouseYFloat = NumberUtils.toRounded((mouseY - top) / height, 4);

        return {
            x: mouseXFloat,
            y: mouseYFloat
        }
    }

    abstract onClickSidebar(): void;

    abstract onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;

    abstract onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;

    abstract onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;

    abstract getImageOverlay(): React.ReactNode;

    protected abstract renderControls(): React.ReactNode;

    render() {
        return (
            <div
                className={`control ${this.props.isCurrentEditor(this)
                    ? "selected"
                    : ""
                    }`}
                onClick={() => this.props.setCurrentEditor(this)}
            >
                {this.renderControls()}
            </div>
        );
    }
}