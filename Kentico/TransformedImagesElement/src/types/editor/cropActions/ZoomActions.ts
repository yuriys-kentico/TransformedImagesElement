import { XYTransform, ZTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps } from "../../../components/editor/controls/BaseControls";

export class ZoomActions extends BaseActions<XYTransform & ZTransform> {
    getTransform(): XYTransform & ZTransform {
        const mouseXTranslation = this.endXFloat - this.startXFloat;
        const mouseYTranslation = this.endYFloat - this.startYFloat;

        const sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        let XFloat = 0;
        let YFloat = 0;
        let ZFloat = 0;

        if (sideFloat !== 0) {
            XFloat = NumberUtils.toRounded(this.startXFloat, 4);
            YFloat = NumberUtils.toRounded(this.startYFloat, 4);
            ZFloat = NumberUtils.toRounded(1 / sideFloat, 4);
        }

        return {
            xFloat: XFloat,
            yFloat: YFloat,
            zFloat: ZFloat,
        }
    }

    getEditingRect(): RectProps {
        const mouseXTranslation = this.endXFloat - this.startXFloat;
        const mouseYTranslation = this.endYFloat - this.startYFloat;

        const sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        const WFloat = NumberUtils.toRounded(sideFloat, 4);
        const HFloat = NumberUtils.toRounded(sideFloat, 4);

        const XFloat = NumberUtils.toRounded(this.startXFloat - sideFloat / 2, 4);
        const YFloat = NumberUtils.toRounded(this.startYFloat - sideFloat / 2, 4);

        return {
            x: XFloat * 100,
            y: YFloat * 100,
            width: WFloat * 100,
            height: HFloat * 100
        };
    }

    getPassiveRect(zoom: XYTransform & ZTransform): RectProps {
        return {
            x: (zoom.xFloat - 1 / (2 * zoom.zFloat)) * 100,
            y: (zoom.yFloat - 1 / (2 * zoom.zFloat)) * 100,
            width: 1 / zoom.zFloat * 100,
            height: 1 / zoom.zFloat * 100
        }
    }
}