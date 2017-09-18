"use strict";
exports.__esModule = true;
function Inject(name) {
    if (name === void 0) { name = ''; }
    return function (obj, method, paramIdx) {
        var injectables = Reflect.getMetadata('npie:injectables', obj) || {};
        injectables[paramIdx] = name;
        Reflect.defineMetadata('npie:injectables', injectables, obj);
    };
}
exports.Inject = Inject;
//# sourceMappingURL=Inject.js.map