import { WHTransform } from "../../transformedImage/Transforms";
import { BaseActions } from "../BaseActions";
import { NumberUtils } from "../../NumberUtils";

import { RectProps, EditAction, ActionParams } from "../../../components/editor/controls/BaseControls";

export class ScaleActions extends BaseActions<WHTransform> {
    getTransform(rectProps: RectProps): WHTransform {
        return {
            wFloat: NumberUtils.toRounded(rectProps.width, 4),
            hFloat: NumberUtils.toRounded(rectProps.height, 4)
        }
    }

    getEditingRect(actionParams: ActionParams, oldScale: WHTransform): RectProps {
        const { action, endXFloat, endYFloat } = actionParams;

        const mouseXTranslation = Math.abs(endXFloat - .5);
        const mouseYTranslation = Math.abs(endYFloat - .5);

        let WFloat = oldScale.wFloat !== 0 ? oldScale.wFloat : 1;
        let HFloat = oldScale.hFloat !== 0 ? oldScale.hFloat : 1;

        switch (action) {
            case EditAction.selecting:
            case EditAction.dragging:
            case EditAction.topLeft:
            case EditAction.bottomRight:
            case EditAction.topRight:
            case EditAction.bottomLeft:
                WFloat = 2 * mouseXTranslation;
                HFloat = 2 * mouseYTranslation;
                break;
            case EditAction.top:
            case EditAction.bottom:
                HFloat = 2 * mouseYTranslation;
                break;
            case EditAction.left:
            case EditAction.right:
                WFloat = 2 * mouseXTranslation;
                break;
        }

        const XFloat = .5 - WFloat / 2;
        const YFloat = .5 - HFloat / 2;

        return {
            x: XFloat,
            y: YFloat,
            width: WFloat,
            height: HFloat
        };
    }

    getPassiveRect(scale: WHTransform): RectProps {
        return {
            x: (.5 - scale.wFloat / 2),
            y: (.5 - scale.hFloat / 2),
            width: scale.wFloat,
            height: scale.hFloat
        }
    }
}