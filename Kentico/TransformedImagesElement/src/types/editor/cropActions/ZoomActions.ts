import { XYTransform, ZTransform } from "../../transformedImage/Transforms";
import { NumberUtils } from "../../NumberUtils";
import { BaseActions } from "../BaseActions";

import { RectProps, ActionParams } from "../../../components/editor/controls/BaseControls";

export class ZoomActions extends BaseActions<XYTransform & ZTransform> {
    getTransform(rectProps: RectProps): XYTransform & ZTransform {
        return {
            xFloat: NumberUtils.toRounded(rectProps.x + rectProps.width / 2, 4),
            yFloat: NumberUtils.toRounded(rectProps.y + rectProps.height / 2, 4),
            zFloat: NumberUtils.toRounded(1 / rectProps.width, 4),
        }
    }

    getEditingRect(actionParams: ActionParams): RectProps {
        const { startXFloat, startYFloat, endXFloat, endYFloat } = actionParams;

        const mouseXTranslation = endXFloat - startXFloat;
        const mouseYTranslation = endYFloat - startYFloat;

        const sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        const WFloat = NumberUtils.toRounded(sideFloat, 4);
        const HFloat = NumberUtils.toRounded(sideFloat, 4);

        const XFloat = NumberUtils.toRounded(startXFloat - sideFloat / 2, 4);
        const YFloat = NumberUtils.toRounded(startYFloat - sideFloat / 2, 4);

        return {
            x: XFloat,
            y: YFloat,
            width: WFloat,
            height: HFloat
        };
    }

    getPassiveRect(zoom: XYTransform & ZTransform): RectProps {
        return {
            x: (zoom.xFloat - 1 / (2 * zoom.zFloat)),
            y: (zoom.yFloat - 1 / (2 * zoom.zFloat)),
            width: 1 / zoom.zFloat,
            height: 1 / zoom.zFloat
        }
    }
}