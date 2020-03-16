import React, { FC, useCallback } from 'react';

import { ITransformedImage } from '../shared/TransformedImage';
import { ImageDetails } from './ImageDetails';

interface IImageListingProps {
  image: ITransformedImage;
  showActions: boolean;
  isSelected: boolean;
  onSelect(image: ITransformedImage): void;
  onRemove(image: ITransformedImage): void;
  onAddParams(image: ITransformedImage): void;
}

export const ImageListingTile: FC<IImageListingProps> = ({
  isSelected,
  image,
  showActions,
  onSelect,
  onAddParams,
  onRemove
}) => {
  const getImageUrl = useCallback((item: ITransformedImage) => item.buildPreviewUrl().getUrl(), []);

  return (
    <div className='imageListingWrapper'>
      <div className={`imageListing ${isSelected ? 'selected' : ''}`}>
        <div className='imageListingActionsPane'>
          {showActions && (
            <>
              <div
                className='imageListingAction imageListingActionAddParams'
                onClick={() => onAddParams(image)}
                data-balloon='Edit transformations'
                data-balloon-pos='down'
              >
                <i aria-hidden='true' className='icon-add-params' />
              </div>
              <a
                className='imageListingAction imageListingActionDownload'
                target='_blank'
                rel='noopener noreferrer'
                href={getImageUrl(image)}
                data-balloon='Download'
                data-balloon-pos='down'
              >
                <i aria-hidden='true' className='icon-download' />
              </a>
              <div
                className='imageListingAction imageListingActionRemove'
                onClick={() => onRemove(image)}
                data-balloon='Remove'
                data-balloon-pos='down'
              >
                <i aria-hidden='true' className='icon-remove' />
              </div>
            </>
          )}
        </div>
        <div className='imageListingPreview' onClick={() => onSelect(image)}>
          <img className='imageListingImage' alt={image.title} src={getImageUrl(image)} />
        </div>
        <div className='imageListingBottom'>
          <ImageDetails image={image} />
        </div>
      </div>
    </div>
  );
};
