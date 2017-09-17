export interface IBuilderMiddleware {
    router: string;
    action: string;
    middleware: Function;
}