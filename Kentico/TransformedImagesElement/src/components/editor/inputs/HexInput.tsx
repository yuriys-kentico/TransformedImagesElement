import * as React from "react";
import { CustomPicker } from "react-color";
import { EditableInput } from "react-color/lib/components/common";

import { IColorInputProps } from "./ColorPicker";

class HexInput extends React.Component<IColorInputProps> {
    render() {
        return (
            <span className="input" data-balloon={this.props.tooltip} data-balloon-pos="down">
                <EditableInput
                    value={this.props.value.hex}
                    onChange={(color) => {
                        Object.assign(this.props.value, { hex: color });
                        this.props.setValue(this.props.value)
                    }}
                />
            </span>

        );
    }
};

export default CustomPicker(HexInput);