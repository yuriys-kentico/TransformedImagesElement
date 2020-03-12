import { IActionParams } from '../controls/IActionParams';
import { IRectProps } from '../controls/IRectProps';

export abstract class BaseActions<TTransform> {
  abstract getTransform(rectProps: IRectProps): TTransform;

  abstract getEditingRect(actionParams: IActionParams, oldTransform?: TTransform): IRectProps;

  abstract getPassiveRect(transform: TTransform): IRectProps;
}
