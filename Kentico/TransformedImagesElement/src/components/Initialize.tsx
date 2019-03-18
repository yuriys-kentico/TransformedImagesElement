import * as React from "react";
import * as ReactDOM from "react-dom";
import { Observable, empty } from "rxjs";
import { ContentManagementClient, AssetModels, AssetResponses } from "kentico-cloud-content-management";

import { ICustomElement } from "./../types/customElement/ICustomElement";
import { IContext } from "./../types/customElement/IContext";
import { TransformedImageModel } from "./../types/transformedImage/TransformedImageModel";
import { TransformedImage } from "./../types/transformedImage/TransformedImage";
import { OPTIONAL_CONFIG } from "../types/customElement/IElementConfig";

import { InvalidUsage } from "./InvalidUsage";
import { TransformedImagesElement, IElementProps, TransformedImagesElementMode } from "./TransformedImagesElement";
import { ErrorBoundary } from "./ErrorBoundary";

export function initElementFromDelivery(element: ICustomElement, context: IContext): void {
    const loadAssetsFromDelivery = (
        context: IContext,
        selectedImageModels: TransformedImageModel[],
        items: AssetModels.Asset[],
        moreAssetsObservable: Observable<AssetResponses.AssetsListResponse>
    ) => {
        const rawAssets = items
            .filter(i =>
                TransformedImage.assetIsImage(i)
            );

        const selectedIds = selectedImageModels ? selectedImageModels.map(i => i.id) : [];

        const elementProps: IElementProps = {
            context: context,
            initialDisabled: element.disabled,
            initialRawImages: rawAssets
                .map(a => new TransformedImage(context.projectId, a)),
            initialSelectedImages: rawAssets
                .filter(rawImage => selectedIds.indexOf(rawImage.id) > -1)
                .map(rawImage => new TransformedImage(
                    context.projectId,
                    rawImage,
                    selectedImageModels.find(foundImage => foundImage.id === rawImage.id)
                ))
                .sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id)),
            initialMode: TransformedImagesElementMode.listing,
            moreAssetsObservable: moreAssetsObservable
        };

        renderElementComponent(elementProps);
    }

    const showError = (error: any) => {
        renderElementComponent({
            initialDisabled: false,
            initialRawImages: [],
            initialSelectedImages: [],
            initialMode: TransformedImagesElementMode.configuration,
            moreAssetsObservable: empty(),
            configurationError: error,
        });
    }

    const renderElementComponent = (elementProps: IElementProps) => {
        ReactDOM.render(
            <ErrorBoundary>
                <TransformedImagesElement {...elementProps} />
            </ErrorBoundary>
            , document.getElementById('root')
        );
    }

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
                response => loadAssetsFromDelivery(
                    context,
                    element.value
                        ? JSON.parse(element.value) as TransformedImageModel[]
                        : [],
                    response.data.items,
                    response.data.pagination.continuationToken !== null
                        ? client.listAssets()
                            .withCustomParameter("continuationToken", response.data.pagination.continuationToken)
                            .toObservable()
                        : empty()),
                error => showError(error)
            );

        if (element.config.editorDefaultToPreview) {
            OPTIONAL_CONFIG.editorDefaultToPreview = element.config.editorDefaultToPreview;
        }

        if (element.config.editorDefaultCropType) {
            OPTIONAL_CONFIG.editorDefaultCropType = element.config.editorDefaultCropType;
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