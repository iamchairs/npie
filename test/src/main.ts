import * as Sequelize from 'sequelize';

import { Builder } from "../../npie/Builder/Builder";

import { TaskService } from './Services/TaskService';

import { HelloWorldController } from './Controllers/HelloWorldController';
import { TasksController } from './Controllers/TasksController';

import { AuthenticationMiddleware } from './Middlewares/Authentication';

var server = Builder.build({
    services: [
        TaskService
    ],
    singletons: [],
    controllers: [
        HelloWorldController,
        TasksController
    ],
    middlewares: [
        AuthenticationMiddleware
    ]
});

server.app.listen(3000, function() {
    console.log('listening');
});