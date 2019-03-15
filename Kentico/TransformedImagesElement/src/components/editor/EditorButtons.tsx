import * as React from "react";

import { SwitchInput } from "./inputs/SwitchInput";

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
                <SwitchInput
                    checked={this.props.usePreview}
                    onClick={() => this.props.onClickPreview()}
                />
            </div>
        );
    }
}