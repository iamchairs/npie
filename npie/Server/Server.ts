import { Router } from "../../node_modules/@types/express/index";
import { Express } from 'express';
import { Container } from "../Container/Container";

export class Server {
    public routers: Router[];

    constructor(public app: Express, public container: Container) {
        this.routers = [];
    }
}