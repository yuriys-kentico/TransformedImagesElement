import * as React from "react";

export interface IBaseControlsProps<TTransformation> {
    getCurrentEditor: BaseControls<this, TTransformation>;
    setCurrentEditor(editor: BaseControls<this, TTransformation>): void;
    getTransformation: TTransformation;
    onSetTransformation: (transformation: TTransformation) => void;
    visible?: boolean;
}

export abstract class BaseControls<IProps extends IBaseControlsProps<TTransformation> = IBaseControlsProps<any>, TTransformation = {}, IState = {}> extends React.Component<IProps, IState> {
    protected buttonIsSelectedClass(comparison: boolean): string {
        return comparison ? "btn--primary" : "btn--secondary";
    }

    constructor(props: IProps) {
        super(props);

        if (props.getCurrentEditor === null) {
            props.setCurrentEditor(this);
        }
    }

    setTransformation(
        transformation: TTransformation
    ): void {
        Object.assign(
            this.props.getTransformation,
            transformation
        );
        this.props.onSetTransformation(transformation);
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