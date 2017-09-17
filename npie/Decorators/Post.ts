import * as esprima from 'esprima';
import { MethodDefinition } from 'estree';

export function Post (path: string = '') {
    return function(obj: any, method: any) {
        let methods = Reflect.getMetadata('npie:actions', obj.constructor) || [];
        methods.push(method);
        Reflect.defineMetadata('npie:actions', methods, obj.constructor);

        var esprimaParse = <any>esprima.parseScript('class X { ' + obj[method] + '}');
        var classBody = esprimaParse.body[0].body;
        let methodDefinition = <MethodDefinition>classBody.body.find((x: any) => x.key.name === method);
        let params = methodDefinition.value.params.map((x:any) => x.name);
        Reflect.defineMetadata('npie:params', params, obj, method);

        Reflect.defineMetadata('npie:method', 'post', obj.constructor, method);
        Reflect.defineMetadata('npie:path', path, obj.constructor, method);
    }
}