import { WHTransform } from "../../transformedImage/Transforms";
import { BaseActions } from "../BaseActions";
import { NumberUtils } from "../../NumberUtils";

import { RectProps, ActionParams, EditAction } from "../../../components/editor/controls/BaseControls";

export class FrameActions extends BaseActions<WHTransform> {
    getTransform(rectProps: RectProps): WHTransform {
        return {
            wFloat: NumberUtils.toRounded(rectProps.width, 4),
            hFloat: NumberUtils.toRounded(rectProps.height, 4)
        }
    }

    getEditingRect(actionParams: ActionParams, oldFrame: WHTransform): RectProps {
        const { action, endXFloat, endYFloat } = actionParams;

        const mouseXTranslation = Math.abs(endXFloat - .5);
        const mouseYTranslation = Math.abs(endYFloat - .5);

        let WFloat = oldFrame.wFloat !== 0 ? oldFrame.wFloat : 1;
        let HFloat = oldFrame.hFloat !== 0 ? oldFrame.hFloat : 1;

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

    getPassiveRect(frame: WHTransform): RectProps {
        return {
            x: (.5 - frame.wFloat / 2),
            y: (.5 - frame.hFloat / 2),
            width: frame.wFloat,
            height: frame.hFloat
        }
    }
}