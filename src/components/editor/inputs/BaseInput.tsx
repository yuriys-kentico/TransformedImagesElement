import * as React from 'react';

export interface IInputProps<TType, TValue> {
    type: TType;
    value: TValue | null;
    setValue(value: TValue): void;
    tooltip: string;
    disabled?: boolean;
    isLabelFirst?: boolean;
}

export interface IInputState<TType> {
    type?: TType | null;
    rawValue: string;
    isValid: boolean;
}

export abstract class BaseInput<TProps extends IInputProps<TType, TValue>, TState extends IInputState<TType>, TType, TValue> extends React.PureComponent<TProps, TState> {
    protected input: HTMLInputElement | null;

    protected isAllowedCharacters = (value: string, characters: string, min: number = 0, max: number | null = null) => new RegExp(`^[${characters}]{${min},${max || ""}}$`).test(value);

    protected storeValueInState = (value: string) => { this.setState({ rawValue: value, isValid: false }); return value; };

    abstract getValue(value: (() => TValue) | TValue | null): string;

    private parseValue(): string {
        if (this.state.rawValue !== "") {
            return this.state.rawValue;
        }
        else if (this.props.value !== null) {
            return this.getValue(this.props.value);
        }

        return "";
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