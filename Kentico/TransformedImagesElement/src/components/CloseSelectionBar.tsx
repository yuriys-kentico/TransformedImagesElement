import * as React from "react";

export interface ICloseSelectionBarProps {
    onClickUpdate(): void;
    onClickCancel(): void;
}

export class CloseSelectionBar extends React.Component<ICloseSelectionBarProps, {}> {
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