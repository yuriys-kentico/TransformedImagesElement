import { XYTransform, WHTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps, ActionParams } from "../../../components/editor/controls/BaseControls";

export class BoxActions extends BaseActions<XYTransform & WHTransform> {
    getTransform(rectProps: RectProps): XYTransform & WHTransform {
        return {
            xFloat: rectProps.x,
            yFloat: rectProps.y,
            wFloat: rectProps.width,
            hFloat: rectProps.height
        }
    }

    getEditingRect(actionParams: ActionParams): RectProps {
        const { startXFloat, startYFloat, endXFloat, endYFloat } = actionParams;

        const XFloat = startXFloat > endXFloat
            ? endXFloat
            : startXFloat;

        const YFloat = startYFloat > endYFloat
            ? endYFloat
            : startYFloat;

        const WFloat = NumberUtils.toRounded(Math.abs(endXFloat - startXFloat), 4);
        const HFloat = NumberUtils.toRounded(Math.abs(endYFloat - startYFloat), 4);

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