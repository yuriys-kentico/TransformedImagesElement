import { XYTransform, ZTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps, ActionParams, EditAction } from "../../../components/editor/controls/BaseControls";

export class ZoomActions extends BaseActions<XYTransform & ZTransform> {
    getTransform(rectProps: RectProps): XYTransform & ZTransform {
        return {
            xFloat: NumberUtils.toRounded(rectProps.x + rectProps.width / 2, 4),
            yFloat: NumberUtils.toRounded(rectProps.y + rectProps.height / 2, 4),
            zFloat: NumberUtils.toRounded(1 / rectProps.width, 4),
        }
    }

    getEditingRect(actionParams: ActionParams, oldZoom: XYTransform & ZTransform): RectProps {
        const { action, startXFloat, startYFloat, endXFloat, endYFloat } = actionParams;

        let mouseXTranslation = endXFloat - startXFloat;
        let mouseYTranslation = endYFloat - startYFloat;

        let sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        let WFloat = 0;
        let HFloat = 0;

        let XFloat = 0;
        let YFloat = 0;

        switch (action) {
            case EditAction.selecting:
                WFloat = sideFloat;
                HFloat = sideFloat;
                XFloat = startXFloat - sideFloat / 2;
                YFloat = startYFloat - sideFloat / 2;
                break;
            case EditAction.dragging:
                WFloat = 1 / oldZoom.zFloat;
                HFloat = 1 / oldZoom.zFloat;
                XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) + mouseXTranslation;
                YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) + mouseYTranslation;
                break;
            case EditAction.top:
                sideFloat = 1 / oldZoom.zFloat - mouseYTranslation;

                WFloat = Math.abs(sideFloat);
                HFloat = Math.abs(sideFloat);

                if (sideFloat > 0) {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) + mouseYTranslation / 2;
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) + mouseYTranslation;
                } else {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) - mouseYTranslation / 2;
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat);
                }
                break;
            case EditAction.bottom:
                sideFloat = 1 / oldZoom.zFloat + mouseYTranslation;

                WFloat = Math.abs(sideFloat);
                HFloat = Math.abs(sideFloat);

                if (sideFloat > 0) {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) - mouseYTranslation / 2;
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat);
                } else {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) + mouseYTranslation / 2;
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) + mouseYTranslation;
                }
                break;
            case EditAction.left:
                sideFloat = 1 / oldZoom.zFloat - mouseXTranslation;

                WFloat = Math.abs(sideFloat);
                HFloat = Math.abs(sideFloat);

                if (sideFloat > 0) {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) + mouseXTranslation;
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) + mouseXTranslation / 2;
                } else {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat);
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) - mouseXTranslation / 2;
                }
                break;
            case EditAction.right:
                sideFloat = 1 / oldZoom.zFloat + mouseXTranslation;

                WFloat = Math.abs(sideFloat);
                HFloat = Math.abs(sideFloat);

                if (sideFloat > 0) {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat);
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) - mouseXTranslation / 2;
                } else {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) + mouseXTranslation;
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) + mouseXTranslation / 2;
                }
                break;
            case EditAction.topLeft:
                mouseXTranslation = endXFloat - (oldZoom.xFloat + 1 / (2 * oldZoom.zFloat));
                mouseYTranslation = endYFloat - (oldZoom.yFloat + 1 / (2 * oldZoom.zFloat));

                sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

                WFloat = Math.abs(sideFloat / 2);
                HFloat = Math.abs(sideFloat / 2);

                if (mouseXTranslation < 0 || mouseYTranslation < 0) {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                } else {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat);
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat);
                }
                break;
            case EditAction.bottomRight:
                mouseXTranslation = endXFloat - (oldZoom.xFloat - 1 / (2 * oldZoom.zFloat));
                mouseYTranslation = endYFloat - (oldZoom.yFloat - 1 / (2 * oldZoom.zFloat));

                sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

                WFloat = Math.abs(sideFloat / 2);
                HFloat = Math.abs(sideFloat / 2);

                if (mouseXTranslation < 0 || mouseYTranslation < 0) {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                } else {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat);
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat);
                }
                break;
            case EditAction.topRight:
                mouseXTranslation = endXFloat - (oldZoom.xFloat - 1 / (2 * oldZoom.zFloat));
                mouseYTranslation = endYFloat - (oldZoom.yFloat + 1 / (2 * oldZoom.zFloat));

                sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

                WFloat = Math.abs(sideFloat / 2);
                HFloat = Math.abs(sideFloat / 2);

                if (mouseXTranslation > 0 || mouseYTranslation < 0) {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat);
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                } else {
                    XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                    YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat);
                }
                break;
            case EditAction.bottomLeft:
                mouseXTranslation = endXFloat - (oldZoom.xFloat + 1 / (2 * oldZoom.zFloat));
                mouseYTranslation = endYFloat - (oldZoom.yFloat - 1 / (2 * oldZoom.zFloat));

                sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

                WFloat = Math.abs(sideFloat / 2);
                HFloat = Math.abs(sideFloat / 2);

                if (mouseXTranslation > 0 || mouseYTranslation < 0) {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat);
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                } else {
                    XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
                    YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat);
                }
                break;
        }

        return {
            x: XFloat,
            y: YFloat,
            width: WFloat,
            height: HFloat
        };
    }

    getPassiveRect(zoom: XYTransform & ZTransform): RectProps {
        return {
            x: zoom.xFloat - 1 / (2 * zoom.zFloat),
            y: zoom.yFloat - 1 / (2 * zoom.zFloat),
            width: 1 / zoom.zFloat,
            height: 1 / zoom.zFloat
        }
    }
}