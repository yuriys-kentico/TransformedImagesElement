import * as React from "react";

import { SwitchInput } from "./inputs/SwitchInput";
import { If } from "../If";

export interface IEditorButtonsProps {
    onClickCancel(): void;
    onClickUpdate(): void;
    onClickPreview(): void;
    usePreview: boolean;
    disabled: boolean;
    editedImageUrl: string;
}

export class EditorButtons extends React.PureComponent<IEditorButtonsProps> {
    render() {
        return (
            <div className="selectionBar">
                <input
                    className="form__text-field urlInput"
                    type="text"
                    autoComplete="off"
                    readOnly={true}
                    value={this.props.editedImageUrl}
                />
                <SwitchInput
                    checked={this.props.usePreview}
                    onClick={() => this.props.onClickPreview()}
                    label="Preview"
                />
                <span>
                    <a
                    className="btn btn--secondary"
                    href={this.props.editedImageUrl}
                    title="Open image in new tab"
                    target="_blank"
                    >
                        Open in new tab
                        <i className="icon-arrow-right-top-square btn__endicon" aria-hidden="true" />
                    </a>
                    <button
                        className="btn btn--destructive"
                        onClick={() => this.props.onClickCancel()}
                    >
                        Cancel
                    </button>
                    <If shouldRender={!this.props.disabled}>
                        <button
                            className="btn btn--primary"
                            onClick={() => this.props.onClickUpdate()}
                        >
                            Update
                        </button>
                    </If>
                </span>

            </div>
        );
    }
}