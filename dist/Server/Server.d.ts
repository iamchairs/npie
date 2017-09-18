/// <reference types="express" />
import { Router } from "../../node_modules/@types/express/index";
import { Express } from 'express';
import { Container } from "../Container/Container";
export declare class Server {
    app: Express;
    container: Container;
    routers: Router[];
    constructor(app: Express, container: Container);
}
