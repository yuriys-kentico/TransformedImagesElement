import { AssetModels } from "kentico-cloud-content-management";
import { ImageUrlBuilder } from "kentico-cloud-delivery/_commonjs/images/image-url-builder";
import { FieldModels } from "kentico-cloud-delivery/_commonjs/fields/field-models";
import { TransformedImageModel } from "./TransformedImageModel";

export class TransformedImage {
    constructor(projectId: string, image: AssetModels.Asset) {
        this.imageUrl = `${this.imageEndpoint}/${projectId}/${image.fileReference.id}/${image.fileName}`;
        this.asset = image;
    }

    private imageEndpoint: string = "https://assets-us-01.kc-usercontent.com";
    private imageUrl: string;

    asset: AssetModels.Asset;

    buildUrl(): ImageUrlBuilder {
        return new ImageUrlBuilder(this.imageUrl);
    }

    getImageUrl(): string {
        return this.imageUrl;
    }

    getDeliveryModel(): FieldModels.AssetModel {
        return new TransformedImageModel(
            new FieldModels.AssetModel(
                this.asset.fileName,
                this.asset.type,
                this.asset.size,
                this.asset.descriptions[0].description,
                this.getImageUrl()
            ),
            this.asset.id
        );
    }

    static parseDeliveryModels(parsedJson: TransformedImageModel[]): string[] {
        return parsedJson
            .map(i => i.id);
    }
};