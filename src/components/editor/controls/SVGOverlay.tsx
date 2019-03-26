import * as React from "react";

import { EditAction, RectProps, RectPropsPercent } from "./BaseControls";
import { If } from "../../If";

export interface ISVGOverlayProps {
    rectProps: RectProps;
    canDrag: boolean;
    isSelecting: boolean;
}

export class SVGOverlay extends React.PureComponent<ISVGOverlayProps> {
    private getGrabCirclesGroup(rectProps: RectProps): JSX.Element {
        const { x, y, width, height } = rectProps;

        const circle = (id: string, radius: number, cx: number, cy: number) =>
            <circle
                cx={`${cx * 100}%`}
                cy={`${cy * 100}%`}
                r={radius}
                id={id}
                className="grabCircle"
            />;

        return (<g>
            {circle(EditAction.top, 10, x + width / 2, y)}
            {circle(EditAction.bottom, 10, x + width / 2, y + height)}
            {circle(EditAction.left, 10, x, y + height / 2)}
            {circle(EditAction.right, 10, x + width, y + height / 2)}
            {circle(EditAction.topRight, 7, x + width, y)}
            {circle(EditAction.bottomLeft, 7, x, y + height)}
            {circle(EditAction.topLeft, 7, x, y)}
            {circle(EditAction.bottomRight, 7, x + width, y + height)}
        </g>);
    }

    render() {
        const { rectProps, canDrag, isSelecting } = this.props;
        const { x, y, width, height } = rectProps;

        const canDragCssClass = canDrag ? "draggable" : "";

        const rectPropsPercent: RectPropsPercent = {
            x: `${x * 100}%`,
            y: `${y * 100}%`,
            width: `${width * 100}%`,
            height: `${height * 100}%`
        }

        return (
            <svg>
                <rect
                    width="100%"
                    height={rectPropsPercent.y}
                    className="outsideRect"
                />
                <rect
                    y={rectPropsPercent.y}
                    width={rectPropsPercent.x}
                    height={rectPropsPercent.height}
                    className="outsideRect"
                />
                <rect
                    x={`${(x + width) * 100}%`}
                    y={rectPropsPercent.y}
                    width={`${(1 - (x + width)) * 100}%`}
                    height={rectPropsPercent.height}
                    className="outsideRect"
                />
                <rect
                    y={`${(y + height) * 100}%`}
                    width="100%"
                    height={`${(1 - (y + height)) * 100}%`}
                    className="outsideRect"
                />
                <rect
                    {...rectPropsPercent}
                    className={`selectRect ${canDragCssClass}`}
                />
                <If shouldRender={
                    !isSelecting
                    && width > 0
                    && height > 0
                }>
                    {this.getGrabCirclesGroup(rectProps)}
                </If>
            </svg>
        );
    }
}