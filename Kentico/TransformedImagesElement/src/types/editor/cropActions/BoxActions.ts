import { XYTransform, WHTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps } from "../../../components/editor/controls/BaseControls";

export class BoxActions extends BaseActions<XYTransform & WHTransform> {
    getTransform(): XYTransform & WHTransform {
        let XFloat = 0;
        let YFloat = 0;

        const WFloat = NumberUtils.toRounded(Math.abs(this.endXFloat - this.startXFloat), 4);
        const HFloat = NumberUtils.toRounded(Math.abs(this.endYFloat - this.startYFloat), 4);

        if (WFloat !== 0 && HFloat !== 0) {
            XFloat = this.startXFloat > this.endXFloat
                ? this.endXFloat
                : this.startXFloat;

            YFloat = this.startYFloat > this.endYFloat
                ? this.endYFloat
                : this.startYFloat;
        }
        return {
            xFloat: XFloat,
            yFloat: YFloat,
            wFloat: WFloat,
            hFloat: HFloat
        }
    }

    getEditingRect(): RectProps {
        const XFloat = this.startXFloat > this.endXFloat
            ? this.endXFloat
            : this.startXFloat;

        const YFloat = this.startYFloat > this.endYFloat
            ? this.endYFloat
            : this.startYFloat;

        const WFloat = NumberUtils.toRounded(Math.abs(this.endXFloat - this.startXFloat), 4);
        const HFloat = NumberUtils.toRounded(Math.abs(this.endYFloat - this.startYFloat), 4);

        return {
            x: XFloat * 100,
            y: YFloat * 100,
            width: WFloat * 100,
            height: HFloat * 100
        };
    }

    getPassiveRect(box: XYTransform & WHTransform): RectProps {
        return {
            x: box.xFloat * 100,
            y: box.yFloat * 100,
            width: box.wFloat * 100,
            height: box.hFloat * 100
        }
    }
}