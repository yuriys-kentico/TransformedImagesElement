import * as React from "react";

export interface IBaseControlsProps {
    getCurrentEditor: () => BaseControls;
    setCurrentEditor(editor: BaseControls): void;
}

export abstract class BaseControls<IProps extends IBaseControlsProps = IBaseControlsProps> extends React.Component<IProps, {}> {
    isCurrent = (): boolean => {
        return this.props.getCurrentEditor() === this;
    }

    getCurrentClass = (): string => {
        return this.isCurrent() ? "selected" : "";
    }

    getButtonClassForTransformationType(comparison: boolean): string {
        return comparison ? "btn--primary" : "btn--secondary";
    }

    constructor(props: IProps) {
        super(props);

        if (props.getCurrentEditor() === null) {
            props.setCurrentEditor(this);
        }
    }

    abstract onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;
    abstract onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;
    abstract onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;
    abstract getImageOverlay(): React.ReactNode;
};