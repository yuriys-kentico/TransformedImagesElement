import { WHTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps, EditAction } from "../../../components/editor/controls/BaseControls";

export class ScaleActions extends BaseActions<WHTransform> {
    getTransform(oldScale: WHTransform): WHTransform {
        let WFloat = 0;
        let HFloat = 0;

        switch (this.action) {
            case EditAction.top:
            case EditAction.bottom:
                const scaleMouseYTranslation = Math.abs(this.endYFloat - .5);

                WFloat = oldScale.wFloat !== 0 ? oldScale.wFloat : 1;
                HFloat = NumberUtils.toRounded(2 * scaleMouseYTranslation, 4);
                break;
            case EditAction.left:
            case EditAction.right:
                const scaleMouseXTranslation = Math.abs(this.endXFloat - .5);

                WFloat = NumberUtils.toRounded(2 * scaleMouseXTranslation, 4);
                HFloat = oldScale.hFloat !== 0 ? oldScale.hFloat : 1;
                break;
        }

        return {
            wFloat: WFloat,
            hFloat: HFloat,
        }
    }

    getEditingRect(oldScale: WHTransform): RectProps {
        let WFloat = 0;
        let HFloat = 0;

        switch (this.action) {
            case EditAction.top:
            case EditAction.bottom:
                const scaleMouseYTranslation = Math.abs(this.endYFloat - .5);

                WFloat = oldScale.wFloat !== 0 ? oldScale.wFloat : 1;
                HFloat = NumberUtils.toRounded(2 * scaleMouseYTranslation, 4);
                break;
            case EditAction.left:
            case EditAction.right:
                const scaleMouseXTranslation = Math.abs(this.endXFloat - .5);

                WFloat = NumberUtils.toRounded(2 * scaleMouseXTranslation, 4);
                HFloat = oldScale.hFloat !== 0 ? oldScale.hFloat : 1;
                break;
        }

        const XFloat = NumberUtils.toRounded(.5 - WFloat / 2, 4);
        const YFloat = NumberUtils.toRounded(.5 - HFloat / 2, 4);

        return {
            x: XFloat * 100,
            y: YFloat * 100,
            width: WFloat * 100,
            height: HFloat * 100
        };
    }

    getPassiveRect(scale: WHTransform): RectProps {
        return {
            x: (.5 - scale.wFloat / 2) * 100,
            y: (.5 - scale.hFloat / 2) * 100,
            width: scale.wFloat * 100,
            height: scale.hFloat * 100
        }
    }
}