"use strict";
exports.__esModule = true;
require("reflect-metadata");
function Injectable() {
    return function (obj) {
        Reflect.defineMetadata('npie:type', 'injectable', obj);
    };
}
exports.Injectable = Injectable;
//# sourceMappingURL=Injectable.js.map