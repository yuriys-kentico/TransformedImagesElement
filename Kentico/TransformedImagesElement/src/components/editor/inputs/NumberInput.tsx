import * as React from "react";

export enum NumberInputType {
    pixel = "px",
    percent = "%",
    float = ""
}

export interface INumberInputProps {
    visible?: boolean;
    type: NumberInputType;
    value: number;
    min?: number;
    max?: number;
    tooltip: string;
    onChange(value: number): void;
}

export class NumberInput extends React.Component<INumberInputProps, {}> {
    render() {
        if (this.props.visible === undefined ? true : this.props.visible) {
            let type = "text";
            let step = 1;
            let label = (
                <span>
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
                        value={this.props.value
                            ? Math.min(this.props.value, this.props.max)
                            : ""
                        }
                        max={this.props.max}
                        onChange={e => this.props.onChange(parseFloat(e.target.value))}
                    />
                    {label}
                </span>
            );
        } else {
            return (
                <span className="input" />
            );
        }
    }
}