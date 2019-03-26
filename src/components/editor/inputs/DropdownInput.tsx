import * as React from "react";

export interface IDropdownInputProps<TEnum> {
    selected: TEnum;
    setSelected(selected: TEnum): void;
    options: string[];
    tooltip: string;
}

export class DropdownInput<TEnum extends string> extends React.PureComponent<IDropdownInputProps<TEnum>> {
    render() {
        return (
            <span
                className="input"
                data-balloon={this.props.tooltip}
                data-balloon-pos="down"
            >
                <select
                    className="form__dropdown"
                    value={this.props.selected}
                    onChange={s => this.props.setSelected(s.target.value as TEnum)}
                >
                    {this.props.options.map((o, i) =>
                        <option key={i}>{o}</option>
                    )}
                </select>
            </span>

        );
    }
}