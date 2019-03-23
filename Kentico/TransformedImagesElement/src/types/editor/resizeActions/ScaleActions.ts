import { WHTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps, EditAction, ActionParams } from "../../../components/editor/controls/BaseControls";

export class ScaleActions extends BaseActions<WHTransform> {
    getTransform(rectProps: RectProps): WHTransform {
        return {
            wFloat: rectProps.width,
            hFloat: rectProps.height
        }
    }

    getEditingRect(actionParams: ActionParams, oldScale: WHTransform): RectProps {
        const { action, endXFloat, endYFloat } = actionParams;

        let WFloat = 0;
        let HFloat = 0;

        const mouseXTranslation = Math.abs(endXFloat - .5);
        const mouseYTranslation = Math.abs(endYFloat - .5);

        switch (action) {
            case EditAction.selecting:
                WFloat = NumberUtils.toRounded(2 * mouseXTranslation, 4);
                HFloat = NumberUtils.toRounded(2 * mouseYTranslation, 4);
                break;
            case EditAction.top:
            case EditAction.bottom:
                WFloat = oldScale.wFloat !== 0 ? oldScale.wFloat : 1;
                HFloat = NumberUtils.toRounded(2 * mouseYTranslation, 4);
                break;
            case EditAction.left:
            case EditAction.right:
                WFloat = NumberUtils.toRounded(2 * mouseXTranslation, 4);
                HFloat = oldScale.hFloat !== 0 ? oldScale.hFloat : 1;
                break;
        }

        const XFloat = NumberUtils.toRounded(.5 - WFloat / 2, 4);
        const YFloat = NumberUtils.toRounded(.5 - HFloat / 2, 4);

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