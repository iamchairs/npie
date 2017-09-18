"use strict";
exports.__esModule = true;
var esprima = require("esprima");
function Delete(path) {
    if (path === void 0) { path = ''; }
    return function (obj, method) {
        var methods = Reflect.getMetadata('npie:actions', obj.constructor) || [];
        methods.push(method);
        Reflect.defineMetadata('npie:actions', methods, obj.constructor);
        var esprimaParse = esprima.parseScript('class X { ' + obj[method] + '}');
        var classBody = esprimaParse.body[0].body;
        var methodDefinition = classBody.body.find(function (x) { return x.key.name === method; });
        var params = methodDefinition.value.params.map(function (x) { return x.name; });
        Reflect.defineMetadata('npie:params', params, obj, method);
        Reflect.defineMetadata('npie:method', 'delete', obj.constructor, method);
        Reflect.defineMetadata('npie:path', path, obj.constructor, method);
    };
}
exports.Delete = Delete;
//# sourceMappingURL=Delete.js.map