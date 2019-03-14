import * as React from "react";

export interface IBaseControlsProps<TTransform> {
    getCurrentEditor: BaseControls<this, TTransform>;
    setCurrentEditor(editor: BaseControls<this, TTransform>): void;
    getTransform: TTransform;
    onSetTransform: (transform: TTransform) => void;
    visible?: boolean;
}

export abstract class BaseControls<IProps extends IBaseControlsProps<TTransform> = IBaseControlsProps<any>, TTransform = {}, IState = {}> extends React.Component<IProps, IState> {
    protected buttonIsSelectedClass(comparison: boolean): string {
        return comparison ? "btn--primary" : "btn--secondary";
    }

    constructor(props: IProps) {
        super(props);

        if (props.getCurrentEditor === null) {
            props.setCurrentEditor(this);
        }
    }

    setTransform(
        transform: TTransform
    ): void {
        Object.assign(
            this.props.getTransform,
            transform
        );
        this.props.onSetTransform(transform);
    }

    abstract onClickSidebar(): void;
    abstract onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;
    abstract onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;
    abstract onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;
    abstract getImageOverlay(): React.ReactNode;
    protected abstract renderControls(): React.ReactNode;

    render() {
        return this.props.visible === undefined || this.props.visible ? (
            <div
                className={`control ${this.props.getCurrentEditor === this
                    ? "selected"
                    : ""
                    }`}
                onClick={() => this.props.setCurrentEditor(this)}
            >
                {this.renderControls()}
            </div>
        ) : null;
    }
}