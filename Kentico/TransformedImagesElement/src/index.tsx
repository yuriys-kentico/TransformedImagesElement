import * as React from "react";
import * as ReactDOM from "react-dom";

import { ContentManagementClient, AssetModels } from "kentico-cloud-content-management";

import { ICustomElement } from "./types/customElement/ICustomElement";
import { IContext } from "./types/customElement/IContext";
import { TransformedImagesElementMode } from "./types/TransformedImagesElementMode";
import { TransformedImageModel } from "./types/transformedImage/TransformedImageModel";
import { TransformedImage } from "./types/transformedImage/TransformedImage";

import { TransformedImagesElement, IElementProps } from "./components/TransformedImagesElement";

require('./styles/style.scss');

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
];

const getAssetsFromDelivery = (element: ICustomElement, context: IContext) => {
    let elementProps: IElementProps = {
        context: context,
        rawImages: [],
        initialSelectedImages: [],
        initialMode: TransformedImagesElementMode.unset,
        configurationError: null
    };

    try {
        const client = new ContentManagementClient({
            projectId: context.projectId,
            apiKey: element.config.contentManagementAPIKey
        });

        client.listAssets()
            .toObservable()
            .subscribe(
                response => setComponentProps(
                    response.data.items,
                    JSON.parse(element.value) as TransformedImageModel[],
                    elementProps
                ),
                error => setError(elementProps, error)
            );
    }
    catch (error) {
        setError(elementProps, error);
        renderElementComponent(elementProps);
    }
};

const setComponentProps = (items: AssetModels.Asset[], selectedImageModels: TransformedImageModel[], elementProps: IElementProps) => {
    const rawAssets = items
        .filter(i =>
            i.imageWidth !== null
            && allowedImageTypes.indexOf(i.type) > -1
        );

    let selectedIds = selectedImageModels ? selectedImageModels.map(i => i.id) : [];

    Object.assign(elementProps,
        {
            rawImages: rawAssets
                .map(a => new TransformedImage(elementProps.context.projectId, a)),
            initialSelectedImages: rawAssets
                .filter(rawImage => selectedIds.indexOf(rawImage.id) > -1)
                .map(rawImage => new TransformedImage(
                    elementProps.context.projectId,
                    rawImage,
                    selectedImageModels.find(foundImage => foundImage.id === rawImage.id)
                ))
                .sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id)),
            initialMode: TransformedImagesElementMode.listing,
        });

    renderElementComponent(elementProps);
}

const setError = (elementProps: IElementProps, error: any) => {
    Object.assign(elementProps,
        {
            initialMode: TransformedImagesElementMode.configuration,
            configurationError: error
        });
}

const renderElementComponent = (elementProps: IElementProps) => {
    ReactDOM.render(<TransformedImagesElement {...elementProps} />, document.getElementById('root'));
}

CustomElement.init(getAssetsFromDelivery);