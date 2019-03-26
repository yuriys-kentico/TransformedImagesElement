import { XYTransform, WHTransform } from "../../transformedImage/Transforms";
import { BaseActions } from "../BaseActions";
import { NumberUtils } from "../../NumberUtils";

import { RectProps, ActionParams, EditAction } from "../../../components/editor/controls/BaseControls";

export class BoxActions extends BaseActions<XYTransform & WHTransform> {
    getTransform(rectProps: RectProps): XYTransform & WHTransform {
        return {
            xFloat: NumberUtils.toRounded(rectProps.x, 4),
            yFloat: NumberUtils.toRounded(rectProps.y, 4),
            wFloat: NumberUtils.toRounded(rectProps.width, 4),
            hFloat: NumberUtils.toRounded(rectProps.height, 4)
        }
    }

    getEditingRect(actionParams: ActionParams, oldBox: XYTransform & WHTransform): RectProps {
        const { action, startXFloat, startYFloat, endXFloat, endYFloat } = actionParams;

        let WFloat = oldBox.wFloat;
        let HFloat = oldBox.hFloat;

        let XFloat = 0;
        let YFloat = 0;

        let mouseXTranslation = endXFloat - startXFloat;
        let mouseYTranslation = endYFloat - startYFloat;

        switch (action) {
            case EditAction.selecting:
                WFloat = Math.abs(mouseXTranslation);
                HFloat = Math.abs(mouseYTranslation);
                XFloat = Math.min(startXFloat, endXFloat);
                YFloat = Math.min(startYFloat, endYFloat);
                break;
            case EditAction.dragging:
                XFloat = oldBox.xFloat + mouseXTranslation;
                YFloat = oldBox.yFloat + mouseYTranslation;
                break;
            case EditAction.top:
                HFloat = Math.abs(oldBox.hFloat - mouseYTranslation);
                XFloat = oldBox.xFloat;
                YFloat = oldBox.yFloat + Math.min(oldBox.hFloat, mouseYTranslation);
                break;
            case EditAction.bottom:
                HFloat = Math.abs(oldBox.hFloat + mouseYTranslation);
                XFloat = oldBox.xFloat;
                YFloat = oldBox.yFloat + Math.min(oldBox.hFloat + mouseYTranslation, 0);
                break;
            case EditAction.left:
                WFloat = Math.abs(oldBox.wFloat - mouseXTranslation);
                XFloat = oldBox.xFloat + Math.min(oldBox.wFloat, mouseXTranslation);
                YFloat = oldBox.yFloat;
                break;
            case EditAction.right:
                WFloat = Math.abs(oldBox.wFloat + mouseXTranslation);
                XFloat = oldBox.xFloat + Math.min(oldBox.wFloat + mouseXTranslation, 0);
                YFloat = oldBox.yFloat;
                break;
            case EditAction.topLeft:
                WFloat = Math.abs(oldBox.wFloat - mouseXTranslation);
                HFloat = Math.abs(oldBox.hFloat - mouseYTranslation);
                XFloat = oldBox.xFloat + Math.min(oldBox.wFloat, mouseXTranslation);
                YFloat = oldBox.yFloat + Math.min(oldBox.hFloat, mouseYTranslation);
                break;
            case EditAction.bottomRight:
                WFloat = Math.abs(oldBox.wFloat + mouseXTranslation);
                HFloat = Math.abs(oldBox.hFloat + mouseYTranslation);
                XFloat = oldBox.xFloat + Math.min(oldBox.wFloat + mouseXTranslation, 0);
                YFloat = oldBox.yFloat + Math.min(oldBox.hFloat + mouseYTranslation, 0);
                break;
            case EditAction.topRight:
                WFloat = Math.abs(oldBox.wFloat + mouseXTranslation);
                HFloat = Math.abs(oldBox.hFloat - mouseYTranslation);
                XFloat = oldBox.xFloat + Math.min(oldBox.wFloat + mouseXTranslation, 0);
                YFloat = oldBox.yFloat + Math.min(oldBox.hFloat, mouseYTranslation);
                break;
            case EditAction.bottomLeft:
                WFloat = Math.abs(oldBox.wFloat - mouseXTranslation);
                HFloat = Math.abs(oldBox.hFloat + mouseYTranslation);
                XFloat = oldBox.xFloat + Math.min(oldBox.wFloat, mouseXTranslation);
                YFloat = oldBox.yFloat + Math.min(oldBox.hFloat + mouseYTranslation, 0);
                break;
        }

        return {
            x: XFloat,
            y: YFloat,
            width: WFloat,
            height: HFloat
        };
    }

    getPassiveRect(box: XYTransform & WHTransform): RectProps {
        return {
            x: box.xFloat,
            y: box.yFloat,
            width: box.wFloat,
            height: box.hFloat
        }
    }
}