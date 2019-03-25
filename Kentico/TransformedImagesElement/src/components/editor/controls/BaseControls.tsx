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

interface MouseParams {
    x: number;
    y: number;
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
    bottomLeft = "bottomLeft",
    left = "left",
    topLeft = "topLeft"
}

export interface IBaseControlsProps<TTransform> {
    isCurrentEditor(editor: BaseControls<this, TTransform>): boolean;
    setCurrentEditor(editor: BaseControls<this, TTransform>): void;
    transform: TTransform;
    setTransform: (transform: TTransform) => void;
    isEditable: boolean;
    imageWidth: number;
    imageHeight: number;
}

export abstract class BaseControls<IProps extends IBaseControlsProps<TTransform> = IBaseControlsProps<any>, TTransform = {}, IState = {}> extends React.Component<IProps, IState> {
    protected buttonIsSelectedClass(comparison: boolean): string {
        return comparison ? "btn--primary" : "btn--secondary";
    }

    protected isCurrentEditorClass(): string {
        return this.props.isCurrentEditor(this)
            ? "selected"
            : "";
    }

    protected isEditableClass(): string {
        return this.props.isEditable
            ? "editable"
            : "";
    }

    protected defaultNumberType = OPTIONAL_CONFIG.inputsDefaultToPercent
        ? NumberInputType.percent
        : NumberInputType.pixel;

    protected allowedNumberTypes = [NumberInputType.pixel, NumberInputType.percent];

    protected getZeroOrNull(value: number): number | null {
        return value >= 0 ? value : null;
    }

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

    private findImageMaskElement(targetElement: Element): Element | null {
        if (targetElement.id === "imageMaskRect") {
            // The mask rect has the same shape as the image mask
            return targetElement;
        } else if (targetElement instanceof SVGElement) {
            const svgParent = (targetElement as SVGElement).ownerSVGElement;

            return svgParent ? svgParent.parentElement : null;
        } else {
            return targetElement.querySelector(".imageMask");
        }
    }

    private getMouseParams(event: React.MouseEvent<HTMLDivElement, MouseEvent>): MouseParams {
        const imageMaskElement = this.findImageMaskElement(event.target as Element);

        if (imageMaskElement) {
            const { left, top, width, height } = imageMaskElement.getBoundingClientRect();
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const mouseXFloat = NumberUtils.toRounded((mouseX - left) / width, 4);
            const mouseYFloat = NumberUtils.toRounded((mouseY - top) / height, 4);

            return {
                x: mouseXFloat,
                y: mouseYFloat,
            }
        }

        return {
            x: 0,
            y: 0,
        }
    }

    abstract onClickSidebar(): void;

    mouseIsInsideRect(mouseParams: MouseParams, currentRectProps: RectProps): boolean {
        return mouseParams.x >= currentRectProps.x
            && mouseParams.x <= currentRectProps.x + currentRectProps.width
            && mouseParams.y >= currentRectProps.y
            && mouseParams.y <= currentRectProps.y + currentRectProps.height;
    }

    setActionParams = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean => {
        const mouseParams = this.getMouseParams(event);

        this.actionParams = {
            startXFloat: mouseParams.x,
            startYFloat: mouseParams.y,
            endXFloat: mouseParams.x,
            endYFloat: mouseParams.y,
            action: EditAction.selecting,
        };

        if (event.target instanceof SVGCircleElement) {
            this.actionParams.action = event.target.id;
        }
        else if (this.mouseIsInsideRect(mouseParams, this.currentRectProps)) {
            this.actionParams.action = EditAction.dragging;
        }

        return true;
    };

    updateActionParams = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean => {
        if (this.actionParams.action !== EditAction.none) {
            const mouseXY = this.getMouseParams(event);

            this.actionParams.endXFloat = mouseXY.x;
            this.actionParams.endYFloat = mouseXY.y;

            return true;
        }

        return false;
    };

    abstract updateTransform(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;

    abstract getImageOverlay(): React.ReactNode;

    protected currentRectProps: RectProps;

    protected readonly noRectProps: RectProps = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    protected readonly fullRectProps: RectProps = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    };

    protected ensureRectWithinImage(rectProps: RectProps): RectProps {
        const { x, y, width, height } = rectProps;

        let newX = NumberUtils.toBetween(x, 1 - width, 0);
        let newY = NumberUtils.toBetween(y, 1 - height, 0);

        let newWidth = NumberUtils.toBetween(width, 1, 0);
        let newHeight = NumberUtils.toBetween(height, 1, 0);

        return {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
        };
    }

    protected getGrabCirclesGroup(rectProps: RectProps): JSX.Element {
        const rectPropsPercent: RectProps = {
            x: rectProps.x * 100,
            y: rectProps.y * 100,
            width: rectProps.width * 100,
            height: rectProps.height * 100
        }

        const { x, y, width, height } = rectPropsPercent;

        const circle = (id: string, radius: number, cx: number, cy: number) => {
            return <circle
                cx={`${cx}%`}
                cy={`${cy}%`}
                r={radius}
                id={id}
                className="grabCircle"
            />
        }

        return (<g>
            {circle(EditAction.top, 10, x + width / 2, y)}
            {circle(EditAction.topRight, 7, x + width, y)}
            {circle(EditAction.right, 10, x + width, y + height / 2)}
            {circle(EditAction.bottomRight, 7, x + width, y + height)}
            {circle(EditAction.bottom, 10, x + width / 2, y + height)}
            {circle(EditAction.bottomLeft, 7, x, y + height)}
            {circle(EditAction.left, 10, x, y + height / 2)}
            {circle(EditAction.topLeft, 7, x, y)}
        </g>);
    }

    protected abstract renderControls(): React.ReactNode;

    render() {
        return (
            <div
                className={`control ${this.isEditableClass()} ${this.isCurrentEditorClass()}`}
                onClick={() => this.props.setCurrentEditor(this)}
            >
                {this.renderControls()}
            </div>
        );
    }
}