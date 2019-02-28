import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";

export class TransformedImageModel extends FieldModels.AssetModel {
    constructor(originalModel: FieldModels.AssetModel, id: string) {
        super(
            originalModel.name,
            originalModel.type,
            originalModel.size,
            originalModel.description,
            originalModel.url,
        );
        this.id = id;
    }

    id: string;
};