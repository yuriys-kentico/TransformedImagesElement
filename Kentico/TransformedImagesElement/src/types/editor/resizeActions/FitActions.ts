import { WHTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps, EditAction } from "../../../components/editor/controls/BaseControls";

export class FitActions extends BaseActions<WHTransform> {
    getTransform(oldFit: WHTransform): WHTransform {
        let WFloat = 0;
        let HFloat = 0;

        switch (this.action) {
            case EditAction.grabTop:
            case EditAction.grabBottom:
                const fitMouseYTranslation = Math.abs(this.endYFloat - .5);

                WFloat = oldFit.wFloat !== 0 ? oldFit.wFloat : 1;
                HFloat = NumberUtils.toRounded(2 * fitMouseYTranslation, 4);
                break;
            case EditAction.grabLeft:
            case EditAction.grabRight:
                const fitMouseXTranslation = Math.abs(this.endXFloat - .5);

                WFloat = NumberUtils.toRounded(2 * fitMouseXTranslation, 4);
                HFloat = oldFit.hFloat !== 0 ? oldFit.hFloat : 1;
                break;
        }

        return {
            wFloat: WFloat,
            hFloat: HFloat,
        }
    }

    getEditingRect(oldFit: WHTransform): RectProps {
        let WFloat = 0;
        let HFloat = 0;

        switch (this.action) {
            case EditAction.grabTop:
            case EditAction.grabBottom:
                const fitMouseYTranslation = Math.abs(this.endYFloat - .5);

                WFloat = oldFit.wFloat !== 0 ? oldFit.wFloat : 1;
                HFloat = NumberUtils.toRounded(2 * fitMouseYTranslation, 4);
                break;
            case EditAction.grabLeft:
            case EditAction.grabRight:
                const fitMouseXTranslation = Math.abs(this.endXFloat - .5);

                WFloat = NumberUtils.toRounded(2 * fitMouseXTranslation, 4);
                HFloat = oldFit.hFloat !== 0 ? oldFit.hFloat : 1;
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

    getPassiveRect(fit: WHTransform): RectProps {
        return {
            x: (.5 - fit.wFloat / 2) * 100,
            y: (.5 - fit.hFloat / 2) * 100,
            width: fit.wFloat * 100,
            height: fit.hFloat * 100
        }
    }
}