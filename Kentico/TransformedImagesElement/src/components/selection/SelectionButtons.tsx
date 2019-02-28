import * as React from "react";

export interface ISelectionButtonsProps {
    onClickUpdate(): void;
    onClickCancel(): void;
}

export class SelectionButtons extends React.Component<ISelectionButtonsProps, {}> {
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
                        disabled={false}
                    >
                        Update
                    </button>
                </span>
            </div>
        );
    }
}