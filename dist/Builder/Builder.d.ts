/// <reference types="express" />
import { RequestHandler } from "express";
import { IBuilderRouter } from "./IBuilderRouter";
import { IBuilderMiddleware } from "./IBuilderMiddleware";
import { IBuilderRoute } from "./IBuilderRoute";
import { Server } from "../Server/Server";
export interface IBuildOptions {
    services: Array<Function | [Function | string, Function]>;
    singletons: [Function | string, any][];
    controllers: Function[];
    middlewares: RequestHandler[];
}
export declare class Builder {
    static routers: IBuilderRouter[];
    static middleware: IBuilderMiddleware[];
    static routes: IBuilderRoute[];
    static build(options: IBuildOptions): Server;
    private static buildRouters(controllers);
    private static buildRoutes(router);
    private static getClassMethods(c);
    private static getParamValues(c, action, req);
}
