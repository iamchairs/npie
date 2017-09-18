"use strict";
exports.__esModule = true;
require("reflect-metadata");
var Container = (function () {
    function Container() {
        this.map = {};
    }
    Container.prototype.register = function (type, concrete) {
        if (concrete === void 0) { concrete = null; }
        var typeName;
        if (typeof (type) === 'string') {
            typeName = type;
            if (concrete === null) {
                throw new Error('Unable to register injectable by string name because the supplied concrete was null: ' + typeName);
            }
        }
        else {
            typeName = type.name;
            concrete = type;
        }
        var existingType = this.map[typeName];
        if (existingType && existingType !== concrete) {
            console.warn('Multiple differing injectable types found for: ' + typeName);
        }
        this.map[typeName] = concrete;
    };
    Container.prototype.singleton = function (type, entity) {
        var typeName;
        if (typeof (type) === 'string') {
            typeName = type;
        }
        else {
            typeName = type.name;
        }
        var existingType = this.map[typeName];
        this.map[typeName] = entity;
    };
    Container.prototype.get = function (type) {
        var typeName;
        if (typeof (type) === 'string') {
            typeName = type;
        }
        else {
            typeName = type.name;
        }
        var record = this.map[typeName];
        if (record) {
            if (typeof record === 'function') {
                return this.getInjected(record);
            }
            return record;
        }
        throw new Error('Type not found in the container: ' + typeName);
    };
    Container.prototype.getInjected = function (type) {
        var paramtypes = Reflect.getMetadata('design:paramtypes', type) || [];
        var types = paramtypes.map(function (x) { return x.name; });
        var injectableOverrides = Reflect.getMetadata('npie:injectables', type);
        for (var key in injectableOverrides) {
            types[key] = injectableOverrides[key];
        }
        var args = [null];
        for (var i = 0; i < types.length; i++) {
            var argType = types[i];
            var arg = this.get(argType);
            args.push(arg);
        }
        return new (type.bind.apply(type, args));
    };
    return Container;
}());
exports.Container = Container;
//# sourceMappingURL=Container.js.map