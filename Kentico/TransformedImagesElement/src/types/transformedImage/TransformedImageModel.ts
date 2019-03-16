import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";

import { ITransforms } from "./Transforms";

export class TransformedImageModel extends FieldModels.AssetModel {
    id: string;
    transforms: ITransforms;

    constructor(
        name: string,
        type: string,
        size: number,
        description: string,
        url: string,
        id: string,
        transforms: ITransforms
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
}