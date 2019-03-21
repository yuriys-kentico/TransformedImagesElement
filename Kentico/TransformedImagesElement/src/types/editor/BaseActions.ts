import { EditAction, RectProps, ActionParams } from "../../components/editor/controls/BaseControls";

export abstract class BaseActions<TTransform> {
    protected startXFloat: number;
    protected startYFloat: number;
    protected endXFloat: number;
    protected endYFloat: number;
    protected action: EditAction | string;

    constructor(actionParams: ActionParams) {
        this.startXFloat = actionParams.startXFloat;
        this.startYFloat = actionParams.startYFloat;
        this.endXFloat = actionParams.endXFloat;
        this.endYFloat = actionParams.endYFloat;
        this.action = actionParams.action;
    }

    abstract getTransform(oldTransform: TTransform): TTransform;

    abstract getEditingRect(oldTransform: TTransform): RectProps;

    abstract getPassiveRect(transform: TTransform): RectProps;
}