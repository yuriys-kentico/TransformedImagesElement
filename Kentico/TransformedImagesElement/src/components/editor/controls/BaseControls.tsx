import * as React from "react";

import { NumberUtils } from "../../../types/NumberUtils";

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

    setTransform<K extends keyof TTransform>(
        transform: (Pick<TTransform, K> | TTransform | null)
    ): void {
        const prevTransform = this.props.transform;

        Object.assign(
            prevTransform,
            transform
        );

        this.props.setTransform(prevTransform);
    }

    getMouseXY(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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