import * as React from "react";
import * as ReactDOM from "react-dom";
import { AssetModels, assetsResponseMapper, AssetContracts } from "kentico-cloud-content-management";
import { HttpService } from "kentico-cloud-core";
import { map } from "rxjs/operators";

import { ICustomElement } from "./../types/customElement/ICustomElement";
import { IContext } from "./../types/customElement/IContext";
import { TransformedImageModel } from "./../types/transformedImage/TransformedImageModel";
import { TransformedImage } from "./../types/transformedImage/TransformedImage";
import { OPTIONAL_CONFIG } from "../types/customElement/IElementConfig";

import { InvalidUsage } from "./InvalidUsage";
import { TransformedImagesElement, IElementProps, TransformedImagesElementMode } from "./TransformedImagesElement";
import { ErrorBoundary } from "./ErrorBoundary";
import { InitializationError } from "./InitializationError";
import { IListAssetsService } from "../types/IListAssetsService";


export const initElement = (element: ICustomElement, context: IContext) => {
    try {
        if (element.config === null) {
            throw Error("The configuration is missing!");
        }

        const endpoint = element.config.listAssetsEndpoint;

        if (!endpoint) {
            throw Error("Endpoint is missing!");
        }

        listAssetsService(element.config.listAssetsEndpoint)
            .subscribe(
                response => parseResponse(element, context, response.data.items, response.data.pagination.continuationToken, listAssetsService, endpoint),
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

const listAssetsService: IListAssetsService = (endpoint: string, continuationToken?: string) => {
    const service = new HttpService();

    let url = endpoint;

    if (continuationToken) {
        url += `?continuationToken=${continuationToken}`;
    }

    return service.get<void, AssetContracts.IAssetsListingResponseContract>({
        mapError: (error) => showError(error),
        url: url
    })
    .pipe(
        map(response => assetsResponseMapper.mapListingAssetsResponse(response))
    );
}

const parseResponse = (element: ICustomElement, context: IContext, items: AssetModels.Asset[], continuationToken: string | null, listAssetsService: IListAssetsService, listAssetsEndpoint: string) => {
    let selectedImageModels: TransformedImageModel[] = [];

    if (element.value) {
        selectedImageModels = JSON.parse(element.value) as TransformedImageModel[];
    }

    const rawAssets = items.filter(i =>
        TransformedImage.assetIsImage(i)
    );

    prepareElementProps(context, element.disabled, selectedImageModels, rawAssets, continuationToken, listAssetsService, listAssetsEndpoint);
}

const prepareElementProps = (context: IContext, disabled: boolean, selectedImageModels: TransformedImageModel[], rawAssets: AssetModels.Asset[], continuationToken: string | null, listAssetsService: IListAssetsService, listAssetsEndpoint: string) => {
    const selectedIds = selectedImageModels.map(i => i.id);

    const moreAssets = (continuationToken: string) => {
        return listAssetsService(listAssetsEndpoint, continuationToken);
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
