import React, { Component, MouseEvent, ReactNode } from 'react';

import { toBetween, toRounded } from '../../../../utilities/numbers';
import { CustomElementContext } from '../../CustomElementContext';
import { NumberInputType } from '../inputs/NumberInputType';
import { EditAction } from './EditAction';
import { IActionParams } from './IActionParams';
import { IRectProps } from './IRectProps';

interface IMouseParams {
  x: number;
  y: number;
}

export interface IBaseControlsProps<TTransform> {
  isCurrentEditor?(editor: BaseControls<this, TTransform>): boolean;
  setCurrentEditor?(editor: BaseControls<this, TTransform>): void;
  transform: TTransform;
  setTransform: (transform: TTransform) => void;
  isEditable: boolean;
  imageWidth: number;
  imageHeight: number;
}

export abstract class BaseControls<
  IProps extends IBaseControlsProps<TTransform> = IBaseControlsProps<any>,
  TTransform = {},
  IState = {}
> extends Component<IProps, IState> {
  static contextType = CustomElementContext;

  declare context: React.ContextType<typeof CustomElementContext>;

  protected buttonIsSelectedClass(comparison: boolean): string {
    return comparison ? 'btn--primary' : 'btn--secondary';
  }

  protected isCurrentEditorCssClass(): string {
    return this.props.isCurrentEditor && this.props.isCurrentEditor(this) ? 'selected' : '';
  }

  protected isEditableCssClass(): string {
    return this.props.isEditable ? 'editable' : '';
  }

  protected defaultNumberType = this.context.inputsDefaultToPercent ? NumberInputType.percent : NumberInputType.pixel;

  protected allowedNumberTypes = [NumberInputType.pixel, NumberInputType.percent];

  protected getZeroOrNull(value: number): number | null {
    return value >= 0 ? value : null;
  }

  protected actionParams: IActionParams = {
    startXFloat: 0,
    startYFloat: 0,
    endXFloat: 0,
    endYFloat: 0,
    action: 'none'
  };

  protected setTransform<K extends keyof TTransform>(transform: Pick<TTransform, K> | TTransform | null): void {
    const prevTransform = this.props.transform;

    Object.assign(prevTransform, transform);

    this.props.setTransform(prevTransform);
  }

  private findImageMaskElement(targetElement: Element): Element | null {
    if (targetElement instanceof SVGElement) {
      const svgParent = (targetElement as SVGElement).ownerSVGElement;

      return svgParent ? svgParent.parentElement : targetElement.parentElement;
    } else {
      return targetElement.querySelector('.imageMask');
    }
  }

  private getMouseParams(event: MouseEvent<HTMLDivElement>): IMouseParams {
    const imageMaskElement = this.findImageMaskElement(event.target as Element);

    if (imageMaskElement) {
      const { left, top, width, height } = imageMaskElement.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const mouseXFloat = toRounded((mouseX - left) / width, 4);
      const mouseYFloat = toRounded((mouseY - top) / height, 4);

      return {
        x: mouseXFloat,
        y: mouseYFloat
      };
    }

    return {
      x: 0,
      y: 0
    };
  }

  abstract onClickSidebar(): void;

  mouseIsInsideRect(mouseParams: IMouseParams, { x, y, width, height }: IRectProps): boolean {
    return mouseParams.x >= x && mouseParams.x <= x + width && mouseParams.y >= y && mouseParams.y <= y + height;
  }

  setActionParams = (event: MouseEvent<HTMLDivElement>): boolean => {
    const mouseParams = this.getMouseParams(event);

    this.actionParams = {
      startXFloat: mouseParams.x,
      startYFloat: mouseParams.y,
      endXFloat: mouseParams.x,
      endYFloat: mouseParams.y,
      action: 'selecting'
    };

    if (event.target instanceof SVGCircleElement) {
      this.actionParams.action = event.target.id as EditAction;
    } else if (this.mouseIsInsideRect(mouseParams, this.currentRectProps)) {
      this.actionParams.action = 'dragging';
    }

    return true;
  };

  updateActionParams = (event: MouseEvent<HTMLDivElement>): boolean => {
    if (this.actionParams.action !== 'none') {
      const mouseXY = this.getMouseParams(event);

      this.actionParams.endXFloat = mouseXY.x;
      this.actionParams.endYFloat = mouseXY.y;

      return true;
    }

    return false;
  };

  abstract updateTransform(event: MouseEvent<HTMLDivElement>): boolean;

  abstract getImageOverlay(): ReactNode;

  protected currentRectProps!: IRectProps;

  protected readonly noRectProps: IRectProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  protected ensureRectWithinImage(rectProps: IRectProps): IRectProps {
    const { x, y, width, height } = rectProps;

    const newX = toBetween(x, 1 - width, 0);
    const newY = toBetween(y, 1 - height, 0);

    const newWidth = toBetween(width, 1, 0);
    const newHeight = toBetween(height, 1, 0);

    return {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    };
  }

  protected abstract renderControls(): ReactNode;

  render() {
    return (
      <div
        className={`control ${this.isEditableCssClass()} ${this.isCurrentEditorCssClass()}`}
        onClick={() => {
          if (this.props.setCurrentEditor) {
            this.props.setCurrentEditor(this);
          }
        }}
      >
        {this.renderControls()}
      </div>
    );
  }
}
