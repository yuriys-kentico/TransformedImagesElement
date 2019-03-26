import { RectProps, ActionParams } from "../../components/editor/controls/BaseControls";

export abstract class BaseActions<TTransform> {
    abstract getTransform(rectProps: RectProps): TTransform;

    abstract getEditingRect(actionParams: ActionParams, oldTransform?: TTransform): RectProps;

    abstract getPassiveRect(transform: TTransform): RectProps;
}