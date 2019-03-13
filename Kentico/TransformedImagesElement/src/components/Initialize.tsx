import * as React from "react";
import * as ReactDOM from "react-dom";

import { ContentManagementClient, AssetModels, AssetResponses } from "kentico-cloud-content-management";

import { ICustomElement } from "./../types/customElement/ICustomElement";
import { IContext } from "./../types/customElement/IContext";
import { TransformedImageModel } from "./../types/transformedImage/TransformedImageModel";
import { TransformedImage } from "./../types/transformedImage/TransformedImage";

import { TransformedImagesElement, IElementProps, TransformedImagesElementMode } from "./TransformedImagesElement";
import { InvalidUsage } from "./InvalidUsage";
import { Observable } from "rxjs";
import { IOptionalConfig } from "../types/customElement/IElementConfig";

export const OPTIONAL_CONFIG: IOptionalConfig = {
    editorDefaultToPreview: false,
    colorPickerDefaultColors: ["#D0021B", "#F5A623", "#F8E71C", "#7ED321", "#417505",
        "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2", "#B8E986", "#000000",
        "#4A4A4A", "#9B9B9B", "#FFFFFF"]
}

export function initElementFromDelivery(element: ICustomElement, context: IContext): void {
    const loadAssetsFromDelivery = (
        context: IContext,
        selectedImageModels: TransformedImageModel[],
        items: AssetModels.Asset[],
        moreAssetsObservable: Observable<AssetResponses.AssetsListResponse>) => {
        const rawAssets = items
            .filter(i =>
                TransformedImage.assetIsImage(i)
            );

        const selectedIds = selectedImageModels ? selectedImageModels.map(i => i.id) : [];

        const elementProps: IElementProps = {
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
            initialMode: TransformedImagesElementMode.configuration,
            configurationError: error,
        });
    }

    const renderElementComponent = (elementProps: IElementProps) => {
        ReactDOM.render(<TransformedImagesElement {...elementProps} />, document.getElementById('root'));
    }

    try {
        const client = new ContentManagementClient({
            projectId: context.projectId,
            apiKey: element.config.contentManagementAPIKey
        });

        client.listAssets()
            .toObservable()
            .subscribe(
                response => loadAssetsFromDelivery(
                    context,
                    JSON.parse(element.value) as TransformedImageModel[],
                    response.data.items,
                    response.data.pagination.continuationToken !== null
                        ? client.listAssets()
                            .withCustomParameter("continuationToken", response.data.pagination.continuationToken)
                            .toObservable()
                        : null),
                error => showError(error)
            );

        OPTIONAL_CONFIG.editorDefaultToPreview = Boolean(element.config.editorDefaultToPreview);
        OPTIONAL_CONFIG.colorPickerDefaultColors = element.config.colorPickerDefaultColors;
    }
    catch (error) {
        showError(error);
    }
};

export function initInvalidUsage(): void {
    ReactDOM.render(<InvalidUsage />, document.getElementById('root'));
}