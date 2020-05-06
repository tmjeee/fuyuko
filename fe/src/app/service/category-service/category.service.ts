import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CategoryWithItems} from "../../model/category.model";
import config from "../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../model/api-response.model";
import {map} from "rxjs/operators";

const URL_GET_CATEGORIES_WITH_ITEMS = () => `${config().api_host_url}/view/:viewId/categories-with-items`;


@Injectable()
export class CategoryService {

    constructor(private httpClient: HttpClient) { }

    getCategoriesWithItems(viewId: number): Observable<CategoryWithItems[]> {
        return this.httpClient.get<ApiResponse<CategoryWithItems[]>>(
            URL_GET_CATEGORIES_WITH_ITEMS().replace(':viewId', String(viewId)))
            .pipe(
                map((r: ApiResponse<CategoryWithItems[]>) => {
                    return r.payload;
                })
            );
    }

}