export class SearchRequest {
    public page: number;

    public limit: number;

    public filters: Filter[];

    public static fromQueryParams(params: any) {
        return new SearchRequest();
    }
}

export class Filter {
    
}