import React, { FC } from 'react';

import { IRectProps } from './IRectProps';

interface ISVGOverlayProps {
  rectProps: IRectProps;
  canDrag: boolean;
  isSelecting: boolean;
}

export const SVGOverlay: FC<ISVGOverlayProps> = ({ rectProps, canDrag, isSelecting }) => {
  const { x, y, width, height } = rectProps;

  const rectPropsPercent = {
    x: `${x * 100}%`,
    y: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`
  };

  const circle = (id: string, radius: number, cx: number, cy: number) => (
    <circle cx={`${cx * 100}%`} cy={`${cy * 100}%`} r={radius} id={id} className='grabCircle' />
  );

  return (
    <svg>
      <rect width='100%' height={rectPropsPercent.y} className='outsideRect' />
      <rect
        y={rectPropsPercent.y}
        width={rectPropsPercent.x}
        height={rectPropsPercent.height}
        className='outsideRect'
      />
      <rect
        x={`${(x + width) * 100}%`}
        y={rectPropsPercent.y}
        width={`${(1 - (x + width)) * 100}%`}
        height={rectPropsPercent.height}
        className='outsideRect'
      />
      <rect y={`${(y + height) * 100}%`} width='100%' height={`${(1 - (y + height)) * 100}%`} className='outsideRect' />
      <rect {...rectPropsPercent} className={`selectRect ${canDrag ? 'draggable' : ''}`} />
      {!isSelecting && width > 0 && height > 0 && (
        <g>
          {circle('top', 10, x + width / 2, y)}
          {circle('bottom', 10, x + width / 2, y + height)}
          {circle('left', 10, x, y + height / 2)}
          {circle('right', 10, x + width, y + height / 2)}
          {circle('topRight', 7, x + width, y)}
          {circle('bottomLeft', 7, x, y + height)}
          {circle('topLeft', 7, x, y)}
          {circle('bottomRight', 7, x + width, y + height)}
        </g>
      )}
    </svg>
  );
};
