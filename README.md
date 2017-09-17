# npie

## Install

```
npm install --save npie
```

## Features

* Built on Express
* Controllers
* Services
* Middlewares
* Route Decorators `@Get`, `@Post`, `@Put`, `@Delete`
* Automatic route param injection
* Route body injection via `@Body`
* Handles `async` and synchronous controller actions

## Basic Usage

**HelloWorldController.ts**

```
import { Controller, Get } from "npie";

@Controller('HelloWorld')
export class HelloWorldController {
    @Get()
    public get() {
        return "Hello World";
    }
}
```

**main.ts**

```
import { Builder } from "npie";

import { HelloWorldController } from './Controllers/HelloWorldController';

var server = Builder.build({
    services: [],
    singletons: [],
    controllers: [
        HelloWorldController
    ],
    middlewares: []
});

server.app.listen(3000, function() {
    console.log('listening');
});
```

`ts-node -C typescript src/main.ts`

## Advanced Usage

See `test/src` in this repo.