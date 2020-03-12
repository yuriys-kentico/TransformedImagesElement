import React, { lazy, Suspense } from 'react';

import { ErrorBoundary } from './ErrorBoundary';
import { Loading } from './Loading';

const InvalidUsage = lazy(() => import('./InvalidUsage').then(module => ({ default: module.InvalidUsage })));
const ImageTransformer = lazy(() =>
  import('./imageTransformer/ImageTransformer').then(module => ({ default: module.ImageTransformer }))
);

export const App = () => {
  const invalidUsage = window.self === window.top;

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        {invalidUsage && <InvalidUsage />}
        {!invalidUsage && <ImageTransformer />}
      </ErrorBoundary>
    </Suspense>
  );
};
