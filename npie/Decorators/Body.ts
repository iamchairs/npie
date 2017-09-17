export function Body () {
    return function(obj: any, method: any, prop: any) {
        console.log(prop);
        Reflect.defineMetadata('npie:body', prop, obj, method);
    }
}