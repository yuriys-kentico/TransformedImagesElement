import React, {
    FC,
    MouseEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
    useState
} from 'react';
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
  editedImage: ITransformedImage;
  isDisabled: boolean;
  isPreview: boolean;
  updateUrl: (url: string) => void;
}

interface IImageWidthHeight {
  width: number;
  height: number;
}

export const EditorView: FC<IImageEditorProps> = ({ editedImage, isDisabled, isPreview, updateUrl }) => {
  const [currentEditor, setCurrentEditor] = useState<BaseControls | null>(null);
  const [mode, setMode] = useState<EditorMode>(isPreview ? 'preview' : 'noPreview');
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [imageMaskHeight, setImageMaskHeight] = useState<string | undefined>(undefined);
  const [imageMaskWidth, setImageMaskWidth] = useState<string | undefined>(undefined);
  const [resizeImageWidthHeight, setResizeImageWidthHeight] = useState<IImageWidthHeight>({ width: 0, height: 0 });
  const [previewImageWidthHeight, setPreviewImageWidthHeight] = useState<IImageWidthHeight>({ width: 0, height: 0 });
  const [editingImageWidthHeight, setEditingImageWidthHeight] = useState<IImageWidthHeight>({ width: 0, height: 0 });

  const imageEditorPreviewRef = useRef<HTMLDivElement | null>(null);
  const firstControlsRef = useRef<CropControls | null>(null);
  const backgroundControlsRef = useRef<BackgroundControls | null>(null);
  const resizeImageRef = useRef<HTMLImageElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const editingImageRef = useRef<HTMLImageElement | null>(null);

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

  useLayoutEffect(() => {
    if (modeIs('editing')) {
      setImageMaskHeight(`${resizeImageWidthHeight.height}px`);
      setImageMaskWidth(`${resizeImageWidthHeight.width}px`);
    }
  }, [resizeImageWidthHeight.height, resizeImageWidthHeight.width, mode, isPreview]);

  useLayoutEffect(() => {
    if (modeIs('preview')) {
      setImageMaskHeight(`${previewImageWidthHeight.height}px`);
      setImageMaskWidth(`${previewImageWidthHeight.width}px`);
    }
  }, [previewImageWidthHeight.height, previewImageWidthHeight.width, mode, isPreview]);

  useLayoutEffect(() => {
    if (modeIs('noPreview')) {
      setImageMaskHeight(`${editingImageWidthHeight.height}px`);
      setImageMaskWidth(`${editingImageWidthHeight.width}px`);
    }
  }, [editingImageWidthHeight.height, editingImageWidthHeight.width, mode, isPreview]);

  const update = useCallback(() => {
    updateUrl(editedImage.buildPreviewUrl().getUrl());
    forceUpdate();
  }, [updateUrl, editedImage]);

  useEffect(() => {
    updateUrl(editedImage.buildPreviewUrl().getUrl());

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
  }, [updateUrl, editedImage, isDisabled, update]);

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

  const { transforms, width, height } = editedImage;

  return (
    <div
      className='editor'
      style={{
        background: `url(${Checkerboard.generate('transparent', 'rgba(0,0,0,.04)', 16)}) center left`
      }}
    >
      <div className='imageEditorPreview' ref={imageEditorPreviewRef}>
        <div className='imageWrapper'>
          <span
            className='imageMask'
            style={{
              maxHeight: imageMaskHeight,
              maxWidth: imageMaskWidth
            }}
          >
            {!modeIs('preview') && !isDisabled && currentEditor && currentEditor.getImageOverlay()}
            <img
              ref={resizeImageRef}
              className='imageEditorImage'
              hidden={!modeIs('editing')}
              src={
                currentEditor instanceof ResizeControls
                  ? editedImage.buildCropUrl().getUrl()
                  : editedImage.buildEditingUrl().getUrl()
              }
              onLoad={event =>
                setResizeImageWidthHeight({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight
                })
              }
            />
            <img
              ref={previewImageRef}
              className='imageEditorImage'
              hidden={!modeIs('preview')}
              src={editedImage.buildPreviewUrl().getUrl()}
              onLoad={event =>
                setPreviewImageWidthHeight({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight
                })
              }
            />
            <img
              ref={editingImageRef}
              className='imageEditorImage'
              hidden={!modeIs('noPreview')}
              src={editedImage.buildEditingUrl().getUrl()}
              onLoad={event =>
                setEditingImageWidthHeight({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight
                })
              }
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
          {editedImage.canBeTransparent() && (
            <BackgroundControls
              ref={backgroundControlsRef}
              transform={transforms.background}
              setTransform={update}
              isEditable={false}
              disableAlpha={editedImage.cannotHaveAlpha()}
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
