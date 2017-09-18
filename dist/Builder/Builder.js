"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var Server_1 = require("../Server/Server");
var HttpResponse_1 = require("../Server/HttpResponse");
var Container_1 = require("../Container/Container");
var Builder = (function () {
    function Builder() {
    }
    Builder.build = function (options) {
        var _this = this;
        var app = express();
        var container = new Container_1.Container();
        var server = new Server_1.Server(app, container);
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json({ type: 'application/json' }));
        console.log('Services: ', options.services.length);
        options.services.forEach(function (svc) {
            if (svc instanceof Array) {
                container.register(svc[0], svc[1]);
            }
            else {
                container.register(svc);
            }
        });
        console.log('Singletons: ', options.singletons.length);
        options.singletons.forEach(function (sng) {
            container.singleton(sng[0], sng[1]);
        });
        console.log('Middlewares: ', options.middlewares.length);
        options.middlewares.forEach(function (middleware) {
            app.use(middleware);
        });
        this.buildRouters(options.controllers);
        this.routers.forEach(function (router) {
            _this.buildRoutes(router);
            var expressRouter = express.Router();
            var path = router.path[0] === '/' ? router.path : '/' + router.path;
            app.use(path, expressRouter);
            console.log('Registering Router: ' + path);
            _this.routes.filter(function (x) { return x.router === router.path; }).forEach(function (route) {
                var middleware = _this.middleware.filter(function (x) { return x.router === router.path && x.action === route.action; }).forEach(function (middleware) {
                    expressRouter[route.method.toLowerCase()](route.path, middleware.middleware);
                });
                var actionPath = route.path[0] === '/' ? route.path : '/' + route.path;
                console.log('\t' + route.method + ' => ' + path + actionPath);
                var routeMiddlewares = Reflect.getMetadata('npie:middlewares', router.controller, route.action) || [];
                console.log('\t\tMiddlewares: ' + routeMiddlewares.length);
                routeMiddlewares.forEach(function (routeMiddleware) {
                    expressRouter.use(actionPath, routeMiddleware);
                });
                expressRouter[route.method.toLowerCase()](actionPath, function (req, res) {
                    var controllerInstance = container.getInjected(router.controller);
                    try {
                        var paramValues = _this.getParamValues(controllerInstance, route.action, req);
                        var response = controllerInstance[route.action].apply(controllerInstance, paramValues);
                        if (response instanceof Promise) {
                            response.then(function (payload) {
                                if (payload instanceof HttpResponse_1.HttpResponse) {
                                    res.status(payload.status).send(payload.message);
                                }
                                else {
                                    res.send(payload);
                                }
                            })["catch"](function (err) {
                                if (err instanceof Error) {
                                    res.status(500).send(err.stack);
                                }
                                else {
                                    res.status(500).send(err);
                                }
                            });
                        }
                        else {
                            res.status(200).send(response);
                        }
                    }
                    catch (e) {
                        if (e instanceof Error) {
                            res.status(500).send(e.message);
                        }
                        else {
                            res.status(500).send(e);
                        }
                    }
                });
            });
        });
        return server;
    };
    Builder.buildRouters = function (controllers) {
        var _this = this;
        controllers.forEach(function (c) {
            var path = Reflect.getMetadata('npie:path', c);
            _this.routers.push({
                path: path,
                controller: c
            });
        });
        return [];
    };
    Builder.buildRoutes = function (router) {
        var _this = this;
        var controller = router.controller;
        var actions = Reflect.getMetadata('npie:actions', controller) || [];
        actions.forEach(function (a) {
            var path = Reflect.getMetadata('npie:path', controller, a);
            var method = Reflect.getMetadata('npie:method', controller, a);
            _this.routes.push({
                router: router.path,
                method: method,
                action: a,
                path: path
            });
        });
    };
    Builder.getClassMethods = function (c) {
        var methods = Reflect.getMetadata('npie:actions', c) || [];
        return methods.map(function (m) { return c.prototype[m]; });
    };
    Builder.getParamValues = function (c, action, req) {
        var values = [];
        var bodyParamIdx = Reflect.getMetadata('npie:body', c, action);
        var params = Reflect.getMetadata('npie:params', c, action) || [];
        var types = Reflect.getMetadata('design:paramtypes', c, action) || [];
        for (var i = 0; i < params.length; i++) {
            if (i === bodyParamIdx) {
                values.push(req.body);
                continue;
            }
            var param = params[i];
            var type = types[i];
            var uncastedValue = req.params[param] || req.query[param] || null;
            var castedValue = void 0;
            switch (type) {
                case String:
                    castedValue = uncastedValue;
                    break;
                case Number:
                    castedValue = parseFloat(uncastedValue);
                    if (isNaN(castedValue)) {
                        castedValue = 0;
                    }
                    break;
                case Boolean:
                    var unl = uncastedValue.toLowerCase();
                    castedValue = (unl === 'true' || unl === '1');
                    break;
                default:
                    throw new Error("Unabled to convert param '" + param + "' to " + type + ". Conversion type not supported. If this is the body of the request, use the @Body decorator");
            }
            values.push(castedValue);
        }
        return values;
    };
    Builder.routers = [];
    Builder.middleware = [];
    Builder.routes = [];
    return Builder;
}());
exports.Builder = Builder;
//# sourceMappingURL=Builder.js.map