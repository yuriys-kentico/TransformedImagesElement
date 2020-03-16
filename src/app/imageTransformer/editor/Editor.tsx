import React, { useContext, useEffect, useRef, useState } from 'react';

import { navigate } from '@reach/router';

import { toNumber } from '../../../utilities/numbers';
import { RoutedFC } from '../../../utilities/routing';
import { Loading } from '../../Loading';
import { CustomElementContext } from '../CustomElementContext';
import { ICustomElement } from '../shared/ICustomElement';
import { ITransformedImage } from '../shared/TransformedImage';
import { ITransforms, Transforms } from '../shared/Transforms';
import { EditorView } from './EditorView';
import { SwitchInput } from './inputs/SwitchInput';

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

interface IEditorProps {
  index: string;
  id: string;
}

export const Editor: RoutedFC<IEditorProps> = ({ index, id }) => {
  const { enabled, selectedImages, editorDefaultToPreview, update } = useContext(CustomElementContext);

  const editorRef = useRef<HTMLDivElement>(null);

  const [editedImageUrl, setEditedImageUrl] = useState('');
  const [editorUsePreview, setEditorUsePreview] = useState(editorDefaultToPreview);
  const [image, setImage] = useState<ITransformedImage | null>(null);
  const [previousEditedTransforms, setPreviousEditedTransforms] = useState<ITransforms | null>(null);

  useEffect(() => {
    if (index && id) {
      const editedImage = selectedImages.find((image, imageIndex) => image.id === id && imageIndex === toNumber(index));

      if (editedImage) {
        setImage(editedImage);
        setPreviousEditedTransforms(Transforms.clone(editedImage.transforms));
      }
    }
  }, [selectedImages, index, id]);

  useEffect(() => {
    if (editorRef.current) {
      CustomElement.setHeight(editorRef.current.scrollHeight);
    }
  });

  const revertEditedImage = () => {
    if (image && previousEditedTransforms) {
      image.transforms = previousEditedTransforms;
    }
  };

  return (
    <>
      {!image && <Loading />}
      {image && (
        <div className='imageEditor' ref={editorRef}>
          <EditorView
            image={image}
            isDisabled={!enabled}
            isPreview={editorUsePreview}
            updateUrl={url => setEditedImageUrl(url)}
          />
          <div className='selectionBar'>
            <input
              className='form__text-field urlInput'
              type='text'
              autoComplete='off'
              readOnly={true}
              value={editedImageUrl}
            />
            <SwitchInput
              checked={editorUsePreview}
              onClick={() => {
                setEditorUsePreview(!editorUsePreview);
              }}
              label='Preview'
            />
            <span>
              <a
                className='btn btn--secondary'
                href={editedImageUrl}
                title='Open image in new tab'
                target='_blank'
                rel='noopener noreferrer'
              >
                Open in new tab
                <i className='icon-arrow-right-top-square btn__endicon' aria-hidden='true' />
              </a>
              <button
                className='btn btn--destructive'
                onClick={() => {
                  revertEditedImage();
                  navigate('/');
                }}
              >
                Cancel
              </button>
              {enabled && (
                <button
                  className='btn btn--primary'
                  onClick={() => {
                    update();
                    navigate('/');
                  }}
                >
                  Update
                </button>
              )}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
