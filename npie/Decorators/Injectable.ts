import 'reflect-metadata';

export function Injectable () {
    return function(obj: any) {
        Reflect.defineMetadata('npie:type', 'injectable', obj);
    }
}