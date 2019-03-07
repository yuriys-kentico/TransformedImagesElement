import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";

import { IImageTransformations } from "./IImageTransformations";

export class TransformedImageModel extends FieldModels.AssetModel {
    id: string;
    transformations: IImageTransformations;

    constructor(
        name: string,
        type: string,
        size: number,
        description: string,
        url: string,
        id: string,
        transformations: IImageTransformations
    ) {
        super(
            name,
            type,
            size,
            description,
            url,
        );

        this.id = id;
        this.transformations = transformations;
    }
};