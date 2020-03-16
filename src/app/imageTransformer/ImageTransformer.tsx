import React, { FC, lazy, Suspense, useCallback, useEffect, useState } from 'react';

import { Router } from '@reach/router';

import { loadModule } from '../../utilities/modules';
import { kenticoKontent } from '../appSettings.json';
import { ErrorBoundary } from '../ErrorBoundary';
import { Loading } from '../Loading';
import {
    CustomElementContext,
    defaultCustomElementContext,
    ICustomElementContext
} from './CustomElementContext';
import { IContext } from './shared/IContext';
import { ICustomElement } from './shared/ICustomElement';
import { ITransformedImage, TransformedImage } from './shared/TransformedImage';

const Listing = lazy(() => import('./listing/Listing').then(module => ({ default: module.Listing })));
const Editor = lazy(() => import('./editor/Editor').then(module => ({ default: module.Editor })));

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

export const ImageTransformer: FC = () => {
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ITransformedImage[]>([]);

  const update = useCallback(() => {
    if (available && enabled) {
      CustomElement.setValue(JSON.stringify(selectedImages.map(selectedImage => selectedImage.getDeliveryModel())));
    }
  }, [available, enabled, selectedImages]);

  const customElementContext: ICustomElementContext = {
    ...defaultCustomElementContext,
    enabled,
    selectedImages,
    setSelectedImages,
    update
  };

  useEffect(() => {
    const initCustomElement = async (element: ICustomElement, context: IContext) => {
      if (element.config !== null) {
        Object.assign(customElementContext, element.config);
      }

      customElementContext.itemContext = context;

      const oldImages = JSON.parse(element.value || JSON.stringify([])) as ITransformedImage[];

      const selectedImages: ITransformedImage[] = [];

      if (oldImages.length > 0) {
        const newImages = await CustomElement.getAssetDetails(oldImages.map(oldImage => oldImage.id));

        for (const oldImage of oldImages) {
          const newImage = newImages.find(newImage => newImage.id === oldImage.id);

          if (newImage) {
            selectedImages.push(
              new TransformedImage(
                newImage,
                TransformedImage.getDescription(newImage, context),
                customElementContext,
                oldImage.transforms
              )
            );
          }
        }
      }

      setAvailable(true);
      setEnabled(!element.disabled);
      setSelectedImages(selectedImages);

      CustomElement.onDisabledChanged(disabled => setEnabled(!disabled));
    };

    loadModule(kenticoKontent.customElementScriptEndpoint, () => CustomElement.init(initCustomElement));
  }, []);

  useEffect(() => {
    update();
  });

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <CustomElementContext.Provider value={customElementContext}>
          {!available && <Loading />}
          {available && (
            <Router>
              <Listing default path='/' />
              <Editor path='/:index/:id' />
            </Router>
          )}
        </CustomElementContext.Provider>
      </ErrorBoundary>
    </Suspense>
  );
};
