import 'reflect-metadata';

export function Controller (path: string) {
    return function(obj: any) {
        Reflect.defineMetadata('npie:type', 'controller', obj);
        Reflect.defineMetadata('npie:path', path, obj);
    }
}