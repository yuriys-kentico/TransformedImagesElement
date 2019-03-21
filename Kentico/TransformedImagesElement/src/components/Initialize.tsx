import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContentManagementClient, AssetModels } from "kentico-cloud-content-management";

import { ICustomElement } from "./../types/customElement/ICustomElement";
import { IContext } from "./../types/customElement/IContext";
import { TransformedImageModel } from "./../types/transformedImage/TransformedImageModel";
import { TransformedImage } from "./../types/transformedImage/TransformedImage";
import { OPTIONAL_CONFIG } from "../types/customElement/IElementConfig";

import { InvalidUsage } from "./InvalidUsage";
import { TransformedImagesElement, IElementProps, TransformedImagesElementMode } from "./TransformedImagesElement";
import { ErrorBoundary } from "./ErrorBoundary";
import { InitializationError } from "./InitializationError";

const parseResponse = (element: ICustomElement, context: IContext, items: AssetModels.Asset[], continuationToken: string | null, client: ContentManagementClient) => {
    let selectedImageModels: TransformedImageModel[] = [];

    if (element.value) {
        selectedImageModels = JSON.parse(element.value) as TransformedImageModel[];
    }

    const rawAssets = items.filter(i =>
        TransformedImage.assetIsImage(i)
    );

    loadAssetsFromDelivery(context, element.disabled, selectedImageModels, rawAssets, continuationToken, client);
}

const loadAssetsFromDelivery = (context: IContext, disabled: boolean, selectedImageModels: TransformedImageModel[], rawAssets: AssetModels.Asset[], continuationToken: string | null, client: ContentManagementClient) => {
    const selectedIds = selectedImageModels.map(i => i.id);

    const moreAssets = (continuationToken: string) => {
        return client.listAssets()
            .withCustomParameter("continuationToken", continuationToken)
            .toObservable();
    };

    const elementProps: IElementProps = {
        context: context,

        initialDisabled: disabled,

        initialRawImages: rawAssets
            .map(a => new TransformedImage(context.projectId, a)),

        initialSelectedImages: rawAssets
            .filter(rawImage => selectedIds.indexOf(rawImage.id) > -1)
            .map(rawImage => new TransformedImage(
                context.projectId,
                rawImage,
                selectedImageModels
                    .find(foundImage => foundImage.id === rawImage.id)
            ))
            .sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id)),

        initialMode: TransformedImagesElementMode.listing,

        continuationToken: continuationToken,
        moreAssets: moreAssets
    };

    renderElementComponent(elementProps);
}

const showError = (error: any) => {
    ReactDOM.render(
        <InitializationError error={error} />
        , document.getElementById('root')
    );
}

const renderElementComponent = (elementProps: IElementProps) => {
    ReactDOM.render(
        <ErrorBoundary>
            <TransformedImagesElement {...elementProps} />
        </ErrorBoundary>
        , document.getElementById('root')
    );
}

export function initElementFromDelivery(element: ICustomElement, context: IContext): void {
    try {
        if (element.config === null) {
            throw Error("The configuration is missing!");
        }

        const client = new ContentManagementClient({
            projectId: context.projectId,
            apiKey: element.config.contentManagementAPIKey
        });

        client.listAssets()
            .toObservable()
            .subscribe(
                response => parseResponse(element, context, response.data.items, response.data.pagination.continuationToken, client),
                error => showError(error)
            );

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
    catch (error) {
        showError(error);
    }
};

export function initInvalidUsage(): void {
    ReactDOM.render(<InvalidUsage />, document.getElementById('root'));
}