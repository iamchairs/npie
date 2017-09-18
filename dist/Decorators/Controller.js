"use strict";
exports.__esModule = true;
require("reflect-metadata");
function Controller(path) {
    return function (obj) {
        Reflect.defineMetadata('npie:type', 'controller', obj);
        Reflect.defineMetadata('npie:path', path, obj);
    };
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map