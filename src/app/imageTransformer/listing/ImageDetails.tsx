import React, { FC } from 'react';

import { ITransformedImage } from '../shared/TransformedImage';

interface IImageDetailsProps {
  image: ITransformedImage;
}

export const ImageDetails: FC<IImageDetailsProps> = ({ image }) => {
  const getFileSize = (sizeInBytes: number): string => {
    let finalSize = sizeInBytes;
    let unit = 'B';

    // GigaBytes
    if (sizeInBytes > 1024 * 1024 * 1024) {
      finalSize = sizeInBytes / 1024 / 1024 / 1024;
      unit = 'GB';
    }
    // MegaBytes
    else if (sizeInBytes > 1024 * 1024) {
      finalSize = sizeInBytes / 1024 / 1024;
      unit = 'MB';
    }
    // KiloBytes
    else if (sizeInBytes > 1024) {
      finalSize = sizeInBytes / 1024;
      unit = 'kB';
    }

    return `${Number(finalSize).toFixed(2)} ${unit}`;
  };

  return (
    <div className='imageDetailsSummary'>
      <div className='imageDetailsTitle'>
        <div className='imageDetailsName'>
          <span className='imageDetailsFileName'>{image.title || image.name}</span>
        </div>
      </div>
      <span className='imageDetailsTechDetails'>
        <span className='imageDetailsTechDetail'>{getFileSize(image.size)}</span>
      </span>
    </div>
  );
};
