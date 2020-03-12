import { toRounded } from '../../../../utilities/numbers';
import { IWHTransform } from '../../shared/Transforms';
import { IActionParams } from '../controls/IActionParams';
import { IRectProps } from '../controls/IRectProps';
import { BaseActions } from './BaseActions';

export class FitActions extends BaseActions<IWHTransform> {
  getTransform(rectProps: IRectProps): IWHTransform {
    return {
      wFloat: toRounded(rectProps.width, 4),
      hFloat: toRounded(rectProps.height, 4)
    };
  }

  getEditingRect(actionParams: IActionParams, oldFit: IWHTransform): IRectProps {
    const { action, endXFloat, endYFloat } = actionParams;

    const mouseXTranslation = Math.abs(endXFloat - 0.5);
    const mouseYTranslation = Math.abs(endYFloat - 0.5);

    let WFloat = oldFit.wFloat !== 0 ? oldFit.wFloat : 1;
    let HFloat = oldFit.hFloat !== 0 ? oldFit.hFloat : 1;

    switch (action) {
      case 'selecting':
      case 'dragging':
      case 'topLeft':
      case 'bottomRight':
      case 'topRight':
      case 'bottomLeft':
        WFloat = 2 * mouseXTranslation;
        HFloat = 2 * mouseYTranslation;
        break;
      case 'top':
      case 'bottom':
        HFloat = 2 * mouseYTranslation;
        break;
      case 'left':
      case 'right':
        WFloat = 2 * mouseXTranslation;
        break;
    }

    const XFloat = 0.5 - WFloat / 2;
    const YFloat = 0.5 - HFloat / 2;

    return {
      x: XFloat,
      y: YFloat,
      width: WFloat,
      height: HFloat
    };
  }

  getPassiveRect(fit: IWHTransform): IRectProps {
    return {
      x: 0.5 - fit.wFloat / 2,
      y: 0.5 - fit.hFloat / 2,
      width: fit.wFloat,
      height: fit.hFloat
    };
  }
}
