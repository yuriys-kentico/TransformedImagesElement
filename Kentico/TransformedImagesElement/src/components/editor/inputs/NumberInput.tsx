import * as React from "react";

export enum NumberInputType {
    pixel = "px",
    percent = "%",
    float = ""
}

export interface INumberInputProps {
    visible?: boolean;
    type: NumberInputType;
    value: string | number;
    min?: number;
    max?: number;
    tooltip: string;
    onChange(value: string): void;
}

export class NumberInput extends React.Component<INumberInputProps, {}> {
    render() {
        const hidden = this.props.visible === undefined ? false : !this.props.visible;
        let type = "text";
        let step = 1;
        let label = (
            <span hidden={hidden}>
                {this.props.type}
            </span>
        );

        switch (this.props.type) {
            case NumberInputType.pixel:
                type = "number";
                break;
            case NumberInputType.percent:
                type = "number";
                step = .01;
                break;
            case NumberInputType.float:
                type = "number";
                step = .01;
                label = null;
                break;
            default:
        }

        return (
            <span className="input" data-balloon={this.props.tooltip} data-balloon-pos="down">
                <input
                    type={type}
                    step={step}
                    value={this.props.value}
                    max={this.props.max}
                    onChange={e => this.props.onChange(e.target.value)}
                    hidden={hidden}
                />
                {label}
            </span>
        );
    }
}