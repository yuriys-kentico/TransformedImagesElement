import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";

import { IImageTransforms } from "./IImageTransforms";

export class TransformedImageModel extends FieldModels.AssetModel {
    id: string;
    transforms: IImageTransforms;

    constructor(
        name: string,
        type: string,
        size: number,
        description: string,
        url: string,
        id: string,
        transforms: IImageTransforms
    ) {
        super(
            name,
            type,
            size,
            description,
            url,
        );

        this.id = id;
        this.transforms = transforms;
    }
};