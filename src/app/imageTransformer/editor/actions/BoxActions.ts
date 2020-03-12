import { toRounded } from '../../../../utilities/numbers';
import { IWHTransform, IXYTransform } from '../../shared/Transforms';
import { IActionParams } from '../controls/IActionParams';
import { IRectProps } from '../controls/IRectProps';
import { BaseActions } from './BaseActions';

export class BoxActions extends BaseActions<IXYTransform & IWHTransform> {
  getTransform(rectProps: IRectProps): IXYTransform & IWHTransform {
    return {
      xFloat: toRounded(rectProps.x, 4),
      yFloat: toRounded(rectProps.y, 4),
      wFloat: toRounded(rectProps.width, 4),
      hFloat: toRounded(rectProps.height, 4)
    };
  }

  getEditingRect(actionParams: IActionParams, oldBox: IXYTransform & IWHTransform): IRectProps {
    const { action, startXFloat, startYFloat, endXFloat, endYFloat } = actionParams;

    let WFloat = oldBox.wFloat;
    let HFloat = oldBox.hFloat;

    let XFloat = 0;
    let YFloat = 0;

    const mouseXTranslation = endXFloat - startXFloat;
    const mouseYTranslation = endYFloat - startYFloat;

    switch (action) {
      case 'selecting':
        WFloat = Math.abs(mouseXTranslation);
        HFloat = Math.abs(mouseYTranslation);
        XFloat = Math.min(startXFloat, endXFloat);
        YFloat = Math.min(startYFloat, endYFloat);
        break;
      case 'dragging':
        XFloat = oldBox.xFloat + mouseXTranslation;
        YFloat = oldBox.yFloat + mouseYTranslation;
        break;
      case 'top':
        HFloat = Math.abs(oldBox.hFloat - mouseYTranslation);
        XFloat = oldBox.xFloat;
        YFloat = oldBox.yFloat + Math.min(oldBox.hFloat, mouseYTranslation);
        break;
      case 'bottom':
        HFloat = Math.abs(oldBox.hFloat + mouseYTranslation);
        XFloat = oldBox.xFloat;
        YFloat = oldBox.yFloat + Math.min(oldBox.hFloat + mouseYTranslation, 0);
        break;
      case 'left':
        WFloat = Math.abs(oldBox.wFloat - mouseXTranslation);
        XFloat = oldBox.xFloat + Math.min(oldBox.wFloat, mouseXTranslation);
        YFloat = oldBox.yFloat;
        break;
      case 'right':
        WFloat = Math.abs(oldBox.wFloat + mouseXTranslation);
        XFloat = oldBox.xFloat + Math.min(oldBox.wFloat + mouseXTranslation, 0);
        YFloat = oldBox.yFloat;
        break;
      case 'topLeft':
        WFloat = Math.abs(oldBox.wFloat - mouseXTranslation);
        HFloat = Math.abs(oldBox.hFloat - mouseYTranslation);
        XFloat = oldBox.xFloat + Math.min(oldBox.wFloat, mouseXTranslation);
        YFloat = oldBox.yFloat + Math.min(oldBox.hFloat, mouseYTranslation);
        break;
      case 'bottomRight':
        WFloat = Math.abs(oldBox.wFloat + mouseXTranslation);
        HFloat = Math.abs(oldBox.hFloat + mouseYTranslation);
        XFloat = oldBox.xFloat + Math.min(oldBox.wFloat + mouseXTranslation, 0);
        YFloat = oldBox.yFloat + Math.min(oldBox.hFloat + mouseYTranslation, 0);
        break;
      case 'topRight':
        WFloat = Math.abs(oldBox.wFloat + mouseXTranslation);
        HFloat = Math.abs(oldBox.hFloat - mouseYTranslation);
        XFloat = oldBox.xFloat + Math.min(oldBox.wFloat + mouseXTranslation, 0);
        YFloat = oldBox.yFloat + Math.min(oldBox.hFloat, mouseYTranslation);
        break;
      case 'bottomLeft':
        WFloat = Math.abs(oldBox.wFloat - mouseXTranslation);
        HFloat = Math.abs(oldBox.hFloat + mouseYTranslation);
        XFloat = oldBox.xFloat + Math.min(oldBox.wFloat, mouseXTranslation);
        YFloat = oldBox.yFloat + Math.min(oldBox.hFloat + mouseYTranslation, 0);
        break;
    }

    return {
      x: XFloat,
      y: YFloat,
      width: WFloat,
      height: HFloat
    };
  }

  getPassiveRect(box: IXYTransform & IWHTransform): IRectProps {
    return {
      x: box.xFloat,
      y: box.yFloat,
      width: box.wFloat,
      height: box.hFloat
    };
  }
}
