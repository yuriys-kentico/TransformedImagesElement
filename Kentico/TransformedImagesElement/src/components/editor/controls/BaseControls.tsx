import * as React from "react";

export interface IBaseControlsProps<TTransform> {
    currentEditor: BaseControls<this, TTransform>;
    setCurrentEditor(editor: BaseControls<this, TTransform>): void;
    transform: TTransform;
    setTransform: (transform: TTransform) => void;
    visible?: boolean;
}

export abstract class BaseControls<IProps extends IBaseControlsProps<TTransform> = IBaseControlsProps<any>, TTransform = {}, IState = {}> extends React.Component<IProps, IState> {
    protected buttonIsSelectedClass(comparison: boolean): string {
        return comparison ? "btn--primary" : "btn--secondary";
    }

    constructor(props: IProps) {
        super(props);

        if (props.currentEditor === null) {
            props.setCurrentEditor(this);
        }
    }

    setTransform<K extends keyof TTransform>(
        transform: (Pick<TTransform, K> | TTransform | null)
    ): void {
        const prevTransform = this.props.transform;

        Object.assign(
            prevTransform,
            transform
        );

        this.props.setTransform(prevTransform);
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
                className={`control ${this.props.currentEditor === this
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