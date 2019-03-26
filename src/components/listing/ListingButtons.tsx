import * as React from "react";

export interface IListingButtonsProps {
    onClickPick(): void;
}

export class ListingButtons extends React.PureComponent<IListingButtonsProps> {
    render() {
        return (
            <div className="selectionBar">
                <span>
                    <button
                        className="btn btn--secondary btn--xs"
                        onClick={() => this.props.onClickPick()}
                    >
                        Pick from Assets
                    </button>
                </span>
                <span
                    className="imageUploaderMessage"
                    hidden={true}
                >
                    <span>
                        <input
                            type="file"
                            multiple={true}
                            style={{ display: "none" }}
                        />
                        <a>Browse</a>
                    </span>
                    <span> or drop assets here to upload.</span>
                </span>
            </div>
        );
    }
}