import * as React from "react";
import * as ReactDOM from "react-dom";

import { ContentManagementClient, AssetModels, ListAssetsQuery } from "kentico-cloud-content-management";

import { ICustomElement } from "./../types/customElement/ICustomElement";
import { IContext } from "./../types/customElement/IContext";
import { TransformedImageModel } from "./../types/transformedImage/TransformedImageModel";
import { TransformedImage } from "./../types/transformedImage/TransformedImage";

import { TransformedImagesElement, IElementProps, TransformedImagesElementMode } from "./TransformedImagesElement";
import { InvalidUsage } from "./InvalidUsage";

export function initElementFromDelivery(element: ICustomElement, context: IContext): void {
    const loadAssetsFromDelivery = (
        projectId: string,
        elementProps: IElementProps,
        selectedImageModels: TransformedImageModel[],
        items: AssetModels.Asset[],
        moreAssetsQuery: ListAssetsQuery) => {
        const rawAssets = items
            .filter(i =>
                TransformedImage.assetIsImage(i)
            );

        const selectedIds = selectedImageModels ? selectedImageModels.map(i => i.id) : [];

        Object.assign<IElementProps, IElementProps>(elementProps,
            {
                initialRawImages: rawAssets
                    .map(a => new TransformedImage(projectId, a)),
                initialSelectedImages: rawAssets
                    .filter(rawImage => selectedIds.indexOf(rawImage.id) > -1)
                    .map(rawImage => new TransformedImage(
                        projectId,
                        rawImage,
                        selectedImageModels.find(foundImage => foundImage.id === rawImage.id)
                    ))
                    .sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id)),
                initialMode: TransformedImagesElementMode.listing,
                moreAssetsQuery: moreAssetsQuery
            });

        renderElementComponent(elementProps);
    }

    const showError = (elementProps: IElementProps, error: any) => {
        elementProps.initialMode = TransformedImagesElementMode.configuration;
        elementProps.configurationError = error;

        renderElementComponent(elementProps);
    }

    const elementProps: IElementProps = {
        context: context,
        initialMode: TransformedImagesElementMode.unset,
        editorDefaultToPreview: Boolean(element.config.editorDefaultToPreview)
    };

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
                    context.projectId,
                    elementProps,
                    JSON.parse(element.value) as TransformedImageModel[],
                    response.data.items,
                    response.data.pagination.continuationToken !== null
                        ? client.listAssets()
                            .withCustomParameter("continuationToken", response.data.pagination.continuationToken)
                        : null),
                error => showError(elementProps, error)
            );
    }
    catch (error) {
        showError(elementProps, error);
    }
};

export function initInvalidUsage(): void {
    ReactDOM.render(<InvalidUsage />, document.getElementById('root'));
}