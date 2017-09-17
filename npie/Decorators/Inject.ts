export function Inject (name: string = '') {
    return function(obj: any, method: any, paramIdx: any) {
        let injectables = Reflect.getMetadata('npie:injectables', obj) || {};

        injectables[paramIdx] = name;

        Reflect.defineMetadata('npie:injectables', injectables, obj);
    }
}