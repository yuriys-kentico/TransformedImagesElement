import { toRounded } from '../../../../utilities/numbers';
import { IWHTransform } from '../../shared/Transforms';
import { IActionParams } from '../controls/IActionParams';
import { IRectProps } from '../controls/IRectProps';
import { BaseActions } from './BaseActions';

export class ScaleActions extends BaseActions<IWHTransform> {
  getTransform(rectProps: IRectProps): IWHTransform {
    return {
      wFloat: toRounded(rectProps.width, 4),
      hFloat: toRounded(rectProps.height, 4)
    };
  }

  getEditingRect(actionParams: IActionParams, oldScale: IWHTransform): IRectProps {
    const { action, endXFloat, endYFloat } = actionParams;

    const mouseXTranslation = Math.abs(endXFloat - 0.5);
    const mouseYTranslation = Math.abs(endYFloat - 0.5);

    let WFloat = oldScale.wFloat !== 0 ? oldScale.wFloat : 1;
    let HFloat = oldScale.hFloat !== 0 ? oldScale.hFloat : 1;

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

  getPassiveRect(scale: IWHTransform): IRectProps {
    return {
      x: 0.5 - scale.wFloat / 2,
      y: 0.5 - scale.hFloat / 2,
      width: scale.wFloat,
      height: scale.hFloat
    };
  }
}
