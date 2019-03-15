import * as React from 'react';

export interface IInputProps<TType, TValue> {
    type: TType;
    value: (() => TValue) | TValue;
    setValue(value: TValue): void;
    tooltip: string;
    disabled?: boolean;
    isLabelFirst?: boolean;
}

export interface IInputState<TType> {
    type?: TType;
    rawValue: string;
    isValid: boolean;
}

export abstract class BaseInput<TProps extends IInputProps<TType, TValue>, TState extends IInputState<TType>, TType, TValue> extends React.PureComponent<TProps, TState> {
    protected input: HTMLInputElement;

    protected isAllowedCharacters = (value: string, characters: string, min: number = 0, max: number = null) => new RegExp(`^[${characters}]{${min},${max || ""}}$`).test(value);

    protected storeValueInState = (value: string) => { this.setState({ rawValue: value, isValid: false }); return value; };

    protected toRounded = (value: number, decimals: number = 0) => Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);

    abstract getValue(value: (() => TValue) | TValue): string;

    private parseValue(): string {
        if (this.state.rawValue !== null) {
            return this.state.rawValue;
        }
        else if (this.props.value !== null) {
            return this.getValue(this.props.value);
        }
    }

    renderInput(): React.ReactNode {
        return (
            <input
                disabled={this.props.disabled}
                className="text-field__input"
                ref={e => this.input = e}
                value={this.parseValue()}
                onChange={() => null}
            />
        );
    }

    abstract renderLabel(): React.ReactNode;

    render() {
        return (
            <span
                className={`input ${this.state.isValid
                    ? ""
                    : "text-field--has-error"}`}
                data-balloon={this.props.tooltip}
                data-balloon-pos="down"
            >
                {this.props.isLabelFirst ? this.renderLabel() : null}
                {this.renderInput()}
                {this.props.isLabelFirst ? null : this.renderLabel()}
            </span>
        );
    }
}