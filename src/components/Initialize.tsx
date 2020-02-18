import * as React from "react";
import * as ReactDOM from "react-dom";

import { ICustomElement } from "./../types/customElement/ICustomElement";
import { IContext } from "./../types/customElement/IContext";

import { TransformedImage } from "./../types/transformedImage/TransformedImage";
import { OPTIONAL_CONFIG } from "../types/customElement/IElementConfig";

import { InvalidUsage } from "./InvalidUsage";
import { TransformedImagesElement, IElementProps, TransformedImagesElementMode } from "./TransformedImagesElement";
import { ErrorBoundary } from "./ErrorBoundary";
import { InitializationError } from "./InitializationError";

export const initElement = (element: ICustomElement, context: IContext) => {
    try {
        if (element.config !== null) {
            if (element.config.editorDefaultToPreview) {
                OPTIONAL_CONFIG.editorDefaultToPreview = element.config.editorDefaultToPreview;
            }

            if (element.config.editorDefaultCropType) {
                OPTIONAL_CONFIG.editorDefaultCropType = element.config.editorDefaultCropType;
            }

            if (element.config.editorDefaultResizeType) {
                OPTIONAL_CONFIG.editorDefaultResizeType = element.config.editorDefaultResizeType;
            }

            if (element.config.inputsDefaultToPercent) {
                OPTIONAL_CONFIG.inputsDefaultToPercent = element.config.inputsDefaultToPercent;
            }

            if (element.config.colorPickerDefaultColors) {
                OPTIONAL_CONFIG.colorPickerDefaultColors = element.config.colorPickerDefaultColors;
            }
        }

        let currentImages:TransformedImage[] = new Array<TransformedImage>();

        if(element.value) {
            currentImages = JSON.parse(element.value).map((ti: TransformedImage) => new TransformedImage(ti))
        }

        prepareElementProps(context, element.disabled, currentImages);

    }
    catch (error) {
        showError(error);
    }
};

const prepareElementProps = (
    context: IContext,
    disabled: boolean,
    currentImages: TransformedImage[]
) => {

    const elementProps: IElementProps = {
        context: context,

        initialDisabled: disabled,

        initialSelectedImages: currentImages,

        initialMode: TransformedImagesElementMode.listing,
    };

    renderElementComponent(elementProps);
}

const renderToRoot = (component: React.ReactElement) => {
    ReactDOM.render(component, document.getElementById('root'));
}

const renderElementComponent = (elementProps: IElementProps) =>
    renderToRoot(
        <ErrorBoundary>
            <TransformedImagesElement {...elementProps} />
        </ErrorBoundary>
    );

const showError = (error: any) => renderToRoot(<InitializationError error={error} />);

export const initInvalidUsage = () => renderToRoot(<InvalidUsage />);
