import * as React from "react";

import { SwitchInput } from "./inputs/SwitchInput";

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
                {
                    // Only possible when 'allow-popups' permission is set on sandboxed parent frame.
                    /* <a
                        className="btn btn--secondary"
                        href={this.props.editedImageUrl}
                        title="Open image in new tab"
                        target="_blank"
                        >
                            Open image in new tab
                            <i className="icon-arrow-right-top-square btn__endicon" aria-hidden="true" />
                        </a>*/
                }
                <span>
                    <button
                        className="btn btn--destructive"
                        onClick={() => this.props.onClickCancel()}
                    >
                        Cancel
                    </button>
                    {
                        this.props.disabled
                            ? null
                            : <button
                                className="btn btn--primary"
                                onClick={() => this.props.onClickUpdate()}
                            >
                                Update
                            </button>
                    }
                </span>

            </div>
        );
    }
}