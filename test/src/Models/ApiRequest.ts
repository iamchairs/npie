import { Request } from 'express';

import { ApiContext } from './ApiContext';

export interface ApiRequest extends Request {
    context: ApiContext;
}