import * as React from "react";

export enum NumberInputType {
    pixel = "px",
    percent = "%",
    float = ".01"
}

export interface INumberInputProps {
    visible?: boolean;
    tooltip: string;
    type: NumberInputType;
    max?: number;
    min?: number;
    value: number;
    setValue(value: number): void;
}

export interface INumberInputState {
    type: NumberInputType;
    temporaryValue: string;
}

export class NumberInput extends React.Component<INumberInputProps, INumberInputState> {
    state: INumberInputState = {
        type: this.props.type,
        temporaryValue: null
    }

    private toggleType(type: NumberInputType): void {
        switch (type) {
            case NumberInputType.pixel:
                this.setState({
                    type: NumberInputType.percent
                });
                break;
            case NumberInputType.percent:
                this.setState({
                    type: NumberInputType.pixel
                });
                break;
        }
    }

    private isProbablyNotTyping(test: string): boolean {
        return /^(\d+\.\d\d)|(\d*\.?(?<=[1-9]\d*))$/.test(test);
    }

    private round(value: number, decimals: number): number {
        return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
    }

    onChange(type: NumberInputType, value: string, max: number, min: number = 0): void {
        switch (type) {
            case NumberInputType.pixel:
                if (value === "" || value.indexOf(".") > -1 || this.isProbablyNotTyping(value)) {
                    this.props.setValue(this.round(Math.max(Math.min(parseInt(value), max), min) / max, 4));
                    this.setState({ temporaryValue: null });
                    return;
                }
                break;
            case NumberInputType.percent:
                if (value === "" || this.isProbablyNotTyping(value)) {
                    this.props.setValue(this.round(Math.max(Math.min(parseFloat(value), max), min) / 100, 4));
                    this.setState({ temporaryValue: null });
                    return;
                }
                break;
            case NumberInputType.float:
                if (value === "" || this.isProbablyNotTyping(value)) {
                    this.props.setValue(Math.max(Math.min(parseFloat(value), max), min));
                    this.setState({ temporaryValue: null });
                    return;
                }
                break;
        }
        this.setState({ temporaryValue: value });
    }

    renderInput(type: NumberInputType, value: number, max: number, min: number): React.ReactNode {
        switch (type) {
            case NumberInputType.pixel:
                return (
                    <input
                        value={this.state.temporaryValue !== null
                            ? this.state.temporaryValue
                            : value !== null
                                ? Math.min(Math.round(value * max), max)
                                : ""
                        }
                        onChange={e => this.onChange(type, e.target.value, max, min)}
                    />
                );
            case NumberInputType.percent:
                return (
                    <input
                        value={this.state.temporaryValue !== null
                            ? this.state.temporaryValue
                            : value !== null
                                ? this.round(Math.min(value * 100, 100), 2)
                                : ""
                        }
                        onChange={e => this.onChange(type, e.target.value, 100, min)}
                    />
                );
            case NumberInputType.float:
                return (
                    <input
                        value={this.state.temporaryValue !== null
                            ? this.state.temporaryValue
                            : value !== null
                                ? Math.min(value, max)
                                : ""
                        }
                        onChange={e => this.onChange(type, e.target.value, max, min)}
                    />
                );
        }
    }

    renderLabel(type: NumberInputType): React.ReactNode {
        switch (type) {
            case NumberInputType.pixel:
            case NumberInputType.percent:
                return (
                    <span
                        className="toggle"
                        title="Toggle between pixels and %"
                        onClick={() => this.toggleType(type)}
                    >
                        {type}
                    </span>
                );
            case NumberInputType.float:
                return (
                    <span>
                        {type}
                    </span>
                );
        }
    }

    render() {
        if (this.props.visible === undefined ? true : this.props.visible) {
            return (
                <span
                    className="input"
                    data-balloon={this.props.tooltip}
                    data-balloon-pos="down"
                >
                    {this.renderInput(this.state.type, this.props.value, this.props.max, this.props.min)}
                    {this.renderLabel(this.state.type)}
                </span>
            );
        } else {
            return (
                <span className="input" />
            );
        }
    }
}