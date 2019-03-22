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

export interface RectPropsPercent {
    x: string;
    y: string;
    width: string;
    height: string;
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

    protected actionParams: ActionParams = {
        startXFloat: 0,
        startYFloat: 0,
        endXFloat: 0,
        endYFloat: 0,
        action: EditAction.none,
    };

    protected setTransform<K extends keyof TTransform>(transform: Pick<TTransform, K> | TTransform | null): void {
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

    onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const mouseXY = this.getMouseXY(event);

        this.actionParams = {
            startXFloat: mouseXY.x,
            startYFloat: mouseXY.y,
            endXFloat: mouseXY.x,
            endYFloat: mouseXY.y,
            action: EditAction.selecting,
        };

        if (event.target instanceof SVGCircleElement) {
            this.actionParams.action = event.target.id;
        }

        return true;
    };

    onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.actionParams.action !== EditAction.none) {
            const mouseXY = this.getMouseXY(event);

            this.actionParams.endXFloat = mouseXY.x;
            this.actionParams.endYFloat = mouseXY.y;

            return true;
        }

        return false;
    };

    protected hasMovedMouse(): boolean {
        return Math.abs(this.actionParams.endXFloat - this.actionParams.startXFloat) > 0
            || Math.abs(this.actionParams.endYFloat - this.actionParams.startYFloat) > 0
    }

    abstract updateTransform(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;

    abstract getImageOverlay(): React.ReactNode;

    protected getGrabCirclesGroup(rectProps: RectProps, rectPropsPercent: RectPropsPercent): JSX.Element {
        const circle = (id: string, radius: number, cx: string, cy: string) => {
            return <circle
                cx={cx}
                cy={cy}
                r={radius}
                id={id}
                className="grabCircle"
            />
        }

        return (<g>
            {circle(EditAction.top, 10, `${rectProps.x + rectProps.width / 2}%`, rectPropsPercent.y)}
            {circle(EditAction.topRight, 7, `${rectProps.x + rectProps.width}%`, rectPropsPercent.y)}
            {circle(EditAction.right, 10, `${rectProps.x + rectProps.width}%`, `${rectProps.y + rectProps.height / 2}%`)}
            {circle(EditAction.bottomRight, 7, `${rectProps.x + rectProps.width}%`, `${rectProps.y + rectProps.height}%`)}
            {circle(EditAction.bottom, 10, `${rectProps.x + rectProps.width / 2}%`, `${rectProps.y + rectProps.height}%`)}
            {circle(EditAction.bottomLeft, 7, rectPropsPercent.x, `${rectProps.y + rectProps.height}%`)}
            {circle(EditAction.left, 10, rectPropsPercent.x, `${rectProps.y + rectProps.height / 2}%`)}
            {circle(EditAction.topLeft, 7, rectPropsPercent.x, rectPropsPercent.y)}
        </g>);
    }

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