import * as React from "react";

export interface IEditorButtonsProps {
    onClickCancel(): void;
    onClickUpdate(): void;
    onClickPreview(): void;
    usePreview: boolean;
}

export class EditorButtons extends React.Component<IEditorButtonsProps> {
    render() {
        return (
            <div className="selectionBar">
                <span>
                    <button
                        className="btn btn--secondary"
                        onClick={() => this.props.onClickCancel()}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn--primary"
                        onClick={() => this.props.onClickUpdate()}
                    >
                        Update
                    </button>
                </span>
                <div className="switch-wrapper">
                    <input
                        id="switchId"
                        type="checkbox"
                        hidden={true}
                        checked={this.props.usePreview}
                        readOnly={true}
                        onClick={() => this.props.onClickPreview()}
                    />
                    <label
                        className="switch"
                        htmlFor="switchId"
                    />
                    <span className="switch__label">
                        Preview
                    </span>
                </div>
            </div>
        );
    }
}