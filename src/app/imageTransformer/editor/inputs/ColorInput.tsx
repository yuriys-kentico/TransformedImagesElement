import React, { FormEvent, ReactNode } from 'react';
import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { is3HexNumbers, is4HexNumbers } from '../../../../utilities/numbers';
import { Color } from '../../shared/Color';
import { BaseInput, IInputProps, IInputState } from './BaseInput';

type ColorInputType = 'HEX';

interface IColorInputProps<TType, TValue> extends IInputProps<TType, TValue> {
  disableAlpha: boolean;
}

export class ColorInput extends BaseInput<
  IColorInputProps<ColorInputType, Color>,
  IInputState<ColorInputType>,
  ColorInputType,
  Color
> {
  state: IInputState<ColorInputType> = {
    type: null,
    rawValue: '',
    isValid: true
  };

  componentDidMount() {
    if (this.input) {
      const rawInput = fromEvent<FormEvent<HTMLInputElement>>(this.input, 'input').pipe(
        map(v => v.currentTarget.value)
      );

      rawInput
        .pipe(rawInput => this.parseRawValue(rawInput))
        .subscribe(v => {
          this.props.setValue(v);
          this.setState({ isValid: true });
        });
    }
  }

  private parseRawValue(rawInput: Observable<string>): Observable<Color> {
    return rawInput.pipe(
      filter(v => this.isAllowedCharacters(v, '0-9a-fA-F', 0, 8)),
      map(this.storeValueInState),
      filter(v => {
        return this.props.disableAlpha ? is3HexNumbers(v) : is4HexNumbers(v);
      }),
      map(Color.fromHex)
    );
  }

  getValue(value: Color): string {
    if (this.props.disableAlpha) {
      value.rgba = { ...value.rgba, a: 0 };
    }

    return value.toShortHexString();
  }

  renderLabel(): ReactNode {
    return <span className='label'>{this.props.type}</span>;
  }

  render() {
    return (
      <span
        className={`input ${this.state.isValid ? '' : 'text-field--has-error'}`}
        data-balloon={this.props.tooltip}
        data-balloon-pos='down'
      >
        {this.renderLabel()}
        {this.renderInput()}
      </span>
    );
  }
}
