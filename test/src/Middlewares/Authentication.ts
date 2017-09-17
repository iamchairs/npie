import { Request, Response } from 'express';

import { Container } from '../../../npie/Container/Container';

import { ApiRequest } from '../Models/ApiRequest';
import { ApiContext } from '../Models/ApiContext';
import { AuthenticationType } from "../Enums/AuthenticationType";
import { Auth } from "../Models/Auth";

export const AuthenticationMiddleware = function(request: ApiRequest, 
                                                 response: Response,
                                                 next: Function) {
    let authHeader = request.header('Authorization');

    let context = new ApiContext();

    if(authHeader) {
        let authKey = authHeader.replace(/Basic/g, '');

        context.auth = new Auth();
        context.auth.key = authKey;
        context.auth.roles = 'Owner';
        context.auth.type = AuthenticationType.Admin;
    }

    request.context = context;

    next();
}