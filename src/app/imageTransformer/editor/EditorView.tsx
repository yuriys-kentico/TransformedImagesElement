import React, { FC, MouseEvent, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { ITransformedImage } from '../shared/TransformedImage';
import { Checkerboard } from './Checkerboard';
import { BackgroundControls } from './controls/BackgroundControls';
import { BaseControls } from './controls/BaseControls';
import { CropControls } from './controls/CropControls';
import { FormatControls } from './controls/FormatControls';
import { ResizeControls } from './controls/ResizeControls';

type EditorMode = 'editing' | 'preview' | 'noPreview';

interface IImageEditorProps {
  image: ITransformedImage;
  isDisabled: boolean;
  isPreview: boolean;
  updateUrl: (url: string) => void;
}

export const EditorView: FC<IImageEditorProps> = ({ image, isDisabled, isPreview, updateUrl }) => {
  const [currentEditor, setCurrentEditor] = useState<BaseControls | null>(null);
  const [mode, setMode] = useState<EditorMode>(isPreview ? 'preview' : 'noPreview');
  const [mouseIsDown, setMouseIsDown] = useState(false);

  const imageEditorPreviewRef = useRef<HTMLDivElement | null>(null);
  const firstControlsRef = useRef<CropControls | null>(null);
  const backgroundControlsRef = useRef<BackgroundControls | null>(null);

  const [, forceUpdate] = useReducer(_ => Object.create(null), null);

  const editorIsCurrent = useCallback((editor: BaseControls) => editor === currentEditor, [currentEditor]);

  const modeIs = useCallback(
    (modeToCheck: EditorMode) => {
      if (mode === 'editing') {
        return modeToCheck === 'editing';
      }

      return isPreview ? modeToCheck === 'preview' : modeToCheck === 'noPreview';
    },
    [mode, isPreview]
  );

  const update = useCallback(() => {
    updateUrl(image.buildPreviewUrl().getUrl());
    forceUpdate();
  }, [updateUrl, image]);

  useEffect(() => {
    updateUrl(image.buildPreviewUrl().getUrl());

    if (imageEditorPreviewRef.current) {
      const eventSubscription = fromEvent<MouseEvent<HTMLDivElement>>(
        imageEditorPreviewRef.current,
        'mouseenter'
      ).subscribe(() => {
        if (!isDisabled) {
          setMode('editing');
          update();
        }
      });

      return () => eventSubscription.unsubscribe();
    }
  }, [updateUrl, image, isDisabled, update]);

  useEffect(() => {
    if (imageEditorPreviewRef.current) {
      const eventSubscription = fromEvent<MouseEvent<HTMLDivElement>>(
        imageEditorPreviewRef.current,
        'mousedown'
      ).subscribe(event => {
        if (event.button !== 2 && !mouseIsDown && currentEditor && currentEditor.setActionParams(event)) {
          setMouseIsDown(true);
          update();
        }
      });

      return () => eventSubscription.unsubscribe();
    }
  }, [mouseIsDown, currentEditor, update]);

  useEffect(() => {
    if (imageEditorPreviewRef.current) {
      const eventSubscription = fromEvent<MouseEvent<HTMLDivElement>>(imageEditorPreviewRef.current, 'mousemove')
        .pipe(throttleTime(10))
        .subscribe(event => {
          if (mouseIsDown && currentEditor && currentEditor.updateActionParams(event)) {
            update();
          }
        });

      return () => eventSubscription.unsubscribe();
    }
  }, [mouseIsDown, currentEditor, update]);

  useEffect(() => {
    if (imageEditorPreviewRef.current) {
      const eventSubscription = fromEvent<MouseEvent<HTMLDivElement>>(
        imageEditorPreviewRef.current,
        'mouseup'
      ).subscribe(event => {
        if (event.button !== 2 && mouseIsDown && currentEditor && currentEditor.updateTransform(event)) {
          setMouseIsDown(false);
          update();
        }
      });

      return () => eventSubscription.unsubscribe();
    }
  }, [mouseIsDown, currentEditor, update]);

  useEffect(() => {
    if (imageEditorPreviewRef.current) {
      const eventSubscription = fromEvent<MouseEvent<HTMLDivElement>>(
        imageEditorPreviewRef.current,
        'mouseleave'
      ).subscribe(event => {
        if (mouseIsDown && currentEditor && currentEditor.updateTransform(event)) {
          setMouseIsDown(false);
        }

        setMode(isPreview ? 'preview' : 'noPreview');
        update();
      });

      return () => eventSubscription.unsubscribe();
    }
  }, [mouseIsDown, currentEditor, isPreview, update]);

  useEffect(() => {
    if (firstControlsRef.current) {
      setCurrentEditor(firstControlsRef.current);
    }
  }, []);

  const getPreviewMaxWidthHeight = () => {
    let widthHeight = { width: 0, height: 0 };

    if (modeIs('editing') && currentEditor instanceof ResizeControls) {
      widthHeight = image.getCropWidthHeight();
    } else if (modeIs('preview')) {
      widthHeight = image.getPreviewWidthHeight();
    } else {
      widthHeight = image.getEditingWidthHeight();
    }

    const { width, height } = widthHeight;

    return { maxWidth: width > 0 ? `${width}px` : undefined, maxHeight: height > 0 ? `${height}px` : undefined };
  };

  const { transforms, width, height } = image;

  return (
    <div
      className='editor'
      style={{
        background: `url(${Checkerboard.generate('transparent', 'rgba(0,0,0,.04)', 16)}) center left`
      }}
    >
      <div className='imageEditorPreview' ref={imageEditorPreviewRef}>
        <div className='imageWrapper'>
          <span className='imageMask' style={getPreviewMaxWidthHeight()}>
            {!modeIs('preview') && !isDisabled && currentEditor && currentEditor.getImageOverlay()}
            <img
              className='imageEditorImage'
              hidden={!modeIs('editing')}
              alt={image.title}
              src={
                currentEditor instanceof ResizeControls
                  ? image.buildCropUrl().getUrl()
                  : image.buildEditingUrl().getUrl()
              }
            />
            <img
              className='imageEditorImage'
              hidden={!modeIs('preview')}
              alt={image.title}
              src={image.buildPreviewUrl().getUrl()}
            />
            <img
              className='imageEditorImage'
              hidden={!modeIs('noPreview')}
              alt={image.title}
              src={image.buildEditingUrl().getUrl()}
            />
          </span>
        </div>
        {!modeIs('editing') && !isDisabled && <span className='hoverToEdit'>(Hover to edit)</span>}
      </div>
      {!isDisabled && (
        <div
          className='editorControls'
          onClick={() => backgroundControlsRef.current && backgroundControlsRef.current.onClickSidebar()}
        >
          <CropControls
            ref={firstControlsRef}
            isCurrentEditor={editorIsCurrent}
            setCurrentEditor={setCurrentEditor}
            transform={transforms.crop}
            setTransform={update}
            isEditable={true}
            imageWidth={width}
            imageHeight={height}
          />
          {transforms.crop.type !== 'zoom' && (
            <ResizeControls
              isCurrentEditor={editorIsCurrent}
              setCurrentEditor={setCurrentEditor}
              transform={transforms.resize}
              setTransform={update}
              isEditable={true}
              cropTransform={transforms.crop}
              imageWidth={width}
              imageHeight={height}
            />
          )}
          {image.canBeTransparent() && (
            <BackgroundControls
              ref={backgroundControlsRef}
              transform={transforms.background}
              setTransform={update}
              isEditable={false}
              disableAlpha={image.cannotHaveAlpha()}
              imageWidth={width}
              imageHeight={height}
            />
          )}
          <FormatControls
            transform={transforms.format}
            setTransform={update}
            isEditable={false}
            imageWidth={width}
            imageHeight={height}
          />
        </div>
      )}
    </div>
  );
};
