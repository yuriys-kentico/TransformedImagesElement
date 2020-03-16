import React, { useContext, useEffect, useRef } from 'react';

import { navigate } from '@reach/router';

import { RoutedFC } from '../../../utilities/routing';
import { CustomElementContext } from '../CustomElementContext';
import { ICustomElement } from '../shared/ICustomElement';
import { TransformedImage } from '../shared/TransformedImage';
import { ImageListingTile } from './ImageListingTile';

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export const Listing: RoutedFC = () => {
  const listingRef = useRef<HTMLDivElement>(null);

  const customElementContext = useContext(CustomElementContext);
  const { itemContext, enabled, selectedImages, setSelectedImages } = customElementContext;

  useEffect(() => {
    if (listingRef.current) {
      CustomElement.setHeight(listingRef.current.scrollHeight);
    }
  });

  const deselectImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);

    setSelectedImages(newSelectedImages);
  };

  const selectImages = async () => {
    const assets = await CustomElement.selectAssets({ allowMultiple: true, fileType: 'images' });
    const assetDetails = await CustomElement.getAssetDetails(assets.map(asset => asset.id));

    const newImages = assetDetails.map(
      assetDetail =>
        new TransformedImage(
          assetDetail,
          TransformedImage.getDescription(assetDetail, itemContext),
          customElementContext
        )
    );

    setSelectedImages([...selectedImages, ...newImages]);
  };

  return (
    <div className='imageListing' ref={listingRef}>
      {enabled && (
        <div className='selectionBar'>
          <span>
            <button className='btn btn--secondary btn--xs' onClick={selectImages}>
              Pick from Assets
            </button>
          </span>
        </div>
      )}
      <div className='list'>
        {selectedImages.map((image, index) => (
          <ImageListingTile
            image={image}
            key={index}
            showActions={enabled}
            isSelected={false}
            onRemove={() => deselectImage(index)}
            onSelect={image => navigate(`/${index}/${image.id}`)}
            onAddParams={image => navigate(`/${index}/${image.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
