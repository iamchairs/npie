"use strict";
exports.__esModule = true;
function Body() {
    return function (obj, method, prop) {
        console.log(prop);
        Reflect.defineMetadata('npie:body', prop, obj, method);
    };
}
exports.Body = Body;
//# sourceMappingURL=Body.js.map