import { Observable } from "rxjs";
import { AssetResponses } from "kentico-cloud-content-management";

export interface IListAssetsService {
    (endpoint: string, continuationToken?: string): Observable<AssetResponses.AssetsListResponse>;
}