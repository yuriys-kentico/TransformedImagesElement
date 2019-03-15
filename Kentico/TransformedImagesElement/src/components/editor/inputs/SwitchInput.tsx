import * as React from "react";
import { enableUniqueIds } from "react-html-id";

export interface ISwitchInputProps {
    onClick(): void;
    checked: boolean;
}

export class SwitchInput extends React.PureComponent<ISwitchInputProps> {
    constructor(props: ISwitchInputProps) {
        super(props);

        enableUniqueIds(this);
    }

    render() {
        return (
            <div className="switch-wrapper">
                <input
                    id={this.nextUniqueId()}
                    type="checkbox"
                    hidden={true}
                    checked={this.props.checked}
                    readOnly={true}
                    onClick={() => this.props.onClick()}
                />
                <label
                    className="switch"
                    htmlFor={this.lastUniqueId()}
                />
                <span className="switch__label">
                    Preview
                    </span>
            </div>
        );
    }
}