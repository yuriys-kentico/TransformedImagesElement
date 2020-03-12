import { toRounded } from '../../../../utilities/numbers';
import { IXYTransform, IZTransform } from '../../shared/Transforms';
import { IActionParams } from '../controls/IActionParams';
import { IRectProps } from '../controls/IRectProps';
import { BaseActions } from './BaseActions';

export class ZoomActions extends BaseActions<IXYTransform & IZTransform> {
  getTransform(rectProps: IRectProps): IXYTransform & IZTransform {
    return {
      xFloat: toRounded(rectProps.x + rectProps.width / 2, 4),
      yFloat: toRounded(rectProps.y + rectProps.height / 2, 4),
      zFloat: toRounded(1 / rectProps.width, 4)
    };
  }

  getEditingRect(actionParams: IActionParams, oldZoom: IXYTransform & IZTransform): IRectProps {
    const { action, startXFloat, startYFloat, endXFloat, endYFloat } = actionParams;

    let mouseXTranslation = endXFloat - startXFloat;
    let mouseYTranslation = endYFloat - startYFloat;

    let sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

    let WFloat = 0;
    let HFloat = 0;

    let XFloat = 0;
    let YFloat = 0;

    switch (action) {
      case 'selecting':
        WFloat = sideFloat;
        HFloat = sideFloat;
        XFloat = startXFloat - sideFloat / 2;
        YFloat = startYFloat - sideFloat / 2;
        break;
      case 'dragging':
        WFloat = 1 / oldZoom.zFloat;
        HFloat = 1 / oldZoom.zFloat;
        XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) + mouseXTranslation;
        YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) + mouseYTranslation;
        break;
      case 'top':
        sideFloat = 1 / oldZoom.zFloat - mouseYTranslation;

        WFloat = Math.abs(sideFloat);
        HFloat = Math.abs(sideFloat);

        if (sideFloat > 0) {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) + mouseYTranslation / 2;
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) + mouseYTranslation;
        } else {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) - mouseYTranslation / 2;
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat);
        }
        break;
      case 'bottom':
        sideFloat = 1 / oldZoom.zFloat + mouseYTranslation;

        WFloat = Math.abs(sideFloat);
        HFloat = Math.abs(sideFloat);

        if (sideFloat > 0) {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) - mouseYTranslation / 2;
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat);
        } else {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) + mouseYTranslation / 2;
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) + mouseYTranslation;
        }
        break;
      case 'left':
        sideFloat = 1 / oldZoom.zFloat - mouseXTranslation;

        WFloat = Math.abs(sideFloat);
        HFloat = Math.abs(sideFloat);

        if (sideFloat > 0) {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) + mouseXTranslation;
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) + mouseXTranslation / 2;
        } else {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat);
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) - mouseXTranslation / 2;
        }
        break;
      case 'right':
        sideFloat = 1 / oldZoom.zFloat + mouseXTranslation;

        WFloat = Math.abs(sideFloat);
        HFloat = Math.abs(sideFloat);

        if (sideFloat > 0) {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat);
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) - mouseXTranslation / 2;
        } else {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) + mouseXTranslation;
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) + mouseXTranslation / 2;
        }
        break;
      case 'topLeft':
        mouseXTranslation = endXFloat - (oldZoom.xFloat + 1 / (2 * oldZoom.zFloat));
        mouseYTranslation = endYFloat - (oldZoom.yFloat + 1 / (2 * oldZoom.zFloat));

        sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        WFloat = Math.abs(sideFloat / 2);
        HFloat = Math.abs(sideFloat / 2);

        if (mouseXTranslation < 0 || mouseYTranslation < 0) {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
        } else {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat);
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat);
        }
        break;
      case 'bottomRight':
        mouseXTranslation = endXFloat - (oldZoom.xFloat - 1 / (2 * oldZoom.zFloat));
        mouseYTranslation = endYFloat - (oldZoom.yFloat - 1 / (2 * oldZoom.zFloat));

        sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        WFloat = Math.abs(sideFloat / 2);
        HFloat = Math.abs(sideFloat / 2);

        if (mouseXTranslation < 0 || mouseYTranslation < 0) {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
        } else {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat);
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat);
        }
        break;
      case 'topRight':
        mouseXTranslation = endXFloat - (oldZoom.xFloat - 1 / (2 * oldZoom.zFloat));
        mouseYTranslation = endYFloat - (oldZoom.yFloat + 1 / (2 * oldZoom.zFloat));

        sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        WFloat = Math.abs(sideFloat / 2);
        HFloat = Math.abs(sideFloat / 2);

        if (mouseXTranslation > 0 || mouseYTranslation < 0) {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat);
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
        } else {
          XFloat = oldZoom.xFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
          YFloat = oldZoom.yFloat + 1 / (2 * oldZoom.zFloat);
        }
        break;
      case 'bottomLeft':
        mouseXTranslation = endXFloat - (oldZoom.xFloat + 1 / (2 * oldZoom.zFloat));
        mouseYTranslation = endYFloat - (oldZoom.yFloat - 1 / (2 * oldZoom.zFloat));

        sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

        WFloat = Math.abs(sideFloat / 2);
        HFloat = Math.abs(sideFloat / 2);

        if (mouseXTranslation > 0 || mouseYTranslation < 0) {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat);
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
        } else {
          XFloat = oldZoom.xFloat + 1 / (2 * oldZoom.zFloat) - sideFloat / 2;
          YFloat = oldZoom.yFloat - 1 / (2 * oldZoom.zFloat);
        }
        break;
    }

    return {
      x: XFloat,
      y: YFloat,
      width: WFloat,
      height: HFloat
    };
  }

  getPassiveRect(zoom: IXYTransform & IZTransform): IRectProps {
    return {
      x: zoom.xFloat - 1 / (2 * zoom.zFloat),
      y: zoom.yFloat - 1 / (2 * zoom.zFloat),
      width: 1 / zoom.zFloat,
      height: 1 / zoom.zFloat
    };
  }
}
