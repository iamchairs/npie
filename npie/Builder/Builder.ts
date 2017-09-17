import * as express from 'express';
import * as bodyParser from 'body-parser';
import { RequestHandler, Request, Response } from "express";

import { IBuilderRouter } from "./IBuilderRouter";
import { IBuilderMiddleware } from "./IBuilderMiddleware";
import { IBuilderRoute } from "./IBuilderRoute";
import { Server } from "../Server/Server";
import { HttpResponse } from '../Server/HttpResponse';
import { Container } from "../Container/Container";

export interface IBuildOptions {
    services: Array<Function | [Function | string, Function]>,
    singletons: [Function | string, any][],
    controllers: Function[],
    middlewares: RequestHandler[]
}

export class Builder {
    static routers: IBuilderRouter[] = [];

    static middleware: IBuilderMiddleware[] = [];

    static routes: IBuilderRoute[] = [];

    static build(options: IBuildOptions) {
        var app = express();
        var container = new Container();
        var server = new Server(app, container);

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json({ type: 'application/json' }));

        console.log('Services: ', options.services.length);

        options.services.forEach((svc) => {
            if(svc instanceof Array) {
                container.register(svc[0], svc[1]);
            } else {
                container.register(svc);
            } 
        });

        console.log('Singletons: ', options.singletons.length);

        options.singletons.forEach((sng) => {
            container.singleton(sng[0], sng[1]);
        });

        console.log('Middlewares: ', options.middlewares.length);

        options.middlewares.forEach((middleware) => {
            app.use(middleware);
        });

        this.buildRouters(options.controllers);
        
        this.routers.forEach((router) => {
            this.buildRoutes(router);

            let expressRouter = express.Router();
            let path = router.path[0] === '/' ? router.path : '/' + router.path;

            app.use(path, expressRouter);

            console.log('Registering Router: ' + path);
            
            this.routes.filter(x => x.router === router.path).forEach((route) => {
                let middleware = this.middleware.filter(x => x.router === router.path && x.action === route.action).forEach((middleware) => {
                    (<any>expressRouter)[route.method.toLowerCase()](route.path, middleware.middleware);
                });

                let actionPath = route.path[0] === '/' ? route.path : '/' + route.path;

                console.log('\t' + route.method + ' => ' + path + actionPath);

                let routeMiddlewares = Reflect.getMetadata('npie:middlewares', router.controller, route.action) || [];

                console.log('\t\tMiddlewares: ' + routeMiddlewares.length);

                routeMiddlewares.forEach((routeMiddleware: RequestHandler) => {
                    (<any>expressRouter).use(actionPath, routeMiddleware);
                });

                (<any>expressRouter)[route.method.toLowerCase()](actionPath, (req: Request, res: Response) => {

                    let controllerInstance = container.getInjected(router.controller);

                    try {
                        let paramValues = this.getParamValues(controllerInstance, route.action, req);
                        let response = controllerInstance[route.action].apply(controllerInstance, paramValues);
                        
                        if(response instanceof Promise) {
                            response.then((payload) => {
                                if(payload instanceof HttpResponse) {
                                    res.status(payload.status).send(payload.message);
                                } else {
                                    res.send(payload);
                                }
                            }).catch((err) => {
                                if(err instanceof Error) {
                                    res.status(500).send(err.stack);
                                } else {
                                    res.status(500).send(err);
                                }
                            });
                        } else {
                            res.status(200).send(response);
                        }
                    } catch(e) {
                        if(e instanceof Error) {
                            res.status(500).send(e.message);
                        } else {
                            res.status(500).send(e);
                        }
                    }
                });
            });
        });

        return server;
    }

    private static buildRouters(controllers: Function[]): IBuilderRouter[] {
        controllers.forEach((c) => {
            let path = Reflect.getMetadata('npie:path', c);

            this.routers.push({
                path: path,
                controller: c
            });
        });

        return [];
    }

    private static buildRoutes(router: IBuilderRouter) {
        let controller = router.controller;
        let actions: string[] = Reflect.getMetadata('npie:actions', controller) || [];

        actions.forEach((a) => {
            let path = Reflect.getMetadata('npie:path', controller, a);
            var method = Reflect.getMetadata('npie:method', controller, a);

            this.routes.push({
                router: router.path,
                method: method,
                action: a,
                path: path
            });
        });
    }

    private static getClassMethods(c: Function) {
        var methods: string[] = Reflect.getMetadata('npie:actions', c) || [];
        return methods.map(m => c.prototype[m]);
    }

    private static getParamValues(c: Function, action: string, req: Request) {
        let values: any[] = [];
        
        let bodyParamIdx = Reflect.getMetadata('npie:body', c, action);

        let params: string[] = Reflect.getMetadata('npie:params', c, action) || [];
        let types: Function[] = Reflect.getMetadata('design:paramtypes', c, action) || [];

        for(var i = 0; i < params.length; i++) {

            if(i === bodyParamIdx) {
                values.push(req.body);
                continue;
            }

            let param = params[i];
            let type = types[i];

            let uncastedValue = req.params[param] || req.query[param] || null;
            let castedValue: any;

            switch(type) {
                case String:
                    castedValue = uncastedValue;
                    break;
                case Number:
                    castedValue = parseFloat(uncastedValue);
                    
                    if(isNaN(castedValue)) {
                        castedValue = 0;
                    }

                    break;
                case Boolean:
                    let unl = uncastedValue.toLowerCase();
                    castedValue = (unl === 'true' || unl === '1');
                    break;
                default:
                    throw new Error(`Unabled to convert param '${param}' to ${type}. Conversion type not supported. If this is the body of the request, use the @Body decorator`);
            }

            values.push(castedValue);
        }

        return values;
    }
}