import { Response } from 'express';

import { ApiRequest } from '../Models/ApiRequest';

import { AuthenticationType } from '../Enums/AuthenticationType';

export function Authorize (... authTypes: AuthenticationType[]) {
    return function(obj: any, method: any) {
        let methods = Reflect.getMetadata('npie:middlewares', obj.constructor, method) || [];

        methods.push(AuthorizeMiddlewareFactory(authTypes));

        Reflect.defineMetadata('npie:middlewares', methods, obj.constructor, method);
    }
}

function AuthorizeMiddlewareFactory(authTypes: AuthenticationType[]) {
    return function(req: ApiRequest, res: Response, next: Function) {
        if(req.context && req.context.auth) {
            if(authTypes.length > 1) {
                if(authTypes.indexOf(req.context.auth.type) != -1) {
                    next();
                } else {
                    res.status(401).send('Unauthorized');
                }
            } else {
                next();
            }
        } else {
            res.status(401).send('Unauthenticated');
        }
    }
}