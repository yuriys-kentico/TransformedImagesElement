import { WHTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps } from "../../../components/editor/controls/BaseControls";

export class FrameActions extends BaseActions<WHTransform> {
    getTransform(): WHTransform {
        const frameMouseXTranslation = Math.abs(this.endXFloat - .5);
        const frameMouseYTranslation = Math.abs(this.endYFloat - .5);

        let WFloat = 0;
        let HFloat = 0;

        if (this.endXFloat - this.startXFloat !== 0) {
            WFloat = NumberUtils.toRounded(2 * frameMouseXTranslation, 4);
            HFloat = NumberUtils.toRounded(2 * frameMouseYTranslation, 4);
        }

        return {
            wFloat: WFloat,
            hFloat: HFloat,
        }
    }

    getEditingRect(): RectProps {
        const frameMouseXTranslation = Math.abs(this.endXFloat - .5);
        const frameMouseYTranslation = Math.abs(this.endYFloat - .5);

        const WFloat = NumberUtils.toRounded(2 * frameMouseXTranslation, 4);
        const HFloat = NumberUtils.toRounded(2 * frameMouseYTranslation, 4);

        const XFloat = NumberUtils.toRounded(.5 - WFloat / 2, 4);
        const YFloat = NumberUtils.toRounded(.5 - HFloat / 2, 4);

        return {
            x: XFloat * 100,
            y: YFloat * 100,
            width: WFloat * 100,
            height: HFloat * 100
        };
    }

    getPassiveRect(frame: WHTransform): RectProps {
        return {
            x: (.5 - frame.wFloat / 2) * 100,
            y: (.5 - frame.hFloat / 2) * 100,
            width: frame.wFloat * 100,
            height: frame.hFloat * 100
        }
    }
}