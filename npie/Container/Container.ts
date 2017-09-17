import 'reflect-metadata';

interface IContainerMap {
    [key: string]: any;
}

export class Container {
    private map: IContainerMap = {}

    public register(type: Function | string, concrete: Function = null) {
        let typeName: string;

        if(typeof(type) === 'string') {
            typeName = type;

            if(concrete === null) {
                throw new Error('Unable to register injectable by string name because the supplied concrete was null: ' + typeName);
            }
        } else {
            typeName = type.name;
            concrete = type;
        }

        let existingType = this.map[typeName];
        
        if(existingType && existingType !== concrete) {
            console.warn('Multiple differing injectable types found for: ' + typeName);
        }

        this.map[typeName] = concrete;
    }

    public singleton(type: Function | string, entity: any) {
        let typeName: string;

        if(typeof(type) === 'string') {
            typeName = type;
        } else {
            typeName = type.name;
        }

        let existingType = this.map[typeName];
        this.map[typeName] = entity;
    }

    public get(type: Function) {
        let typeName: string;

        if(typeof(type) === 'string' ) {
            typeName = type;
        } else {
            typeName = type.name;
        }

        let record = this.map[typeName];

        if(record) {
            if(typeof record === 'function') {
                return this.getInjected(record);
            }

            return record;
        }

        throw new Error('Type not found in the container: ' + typeName);
    }

    public getInjected<T>(type: T): any {
        var paramtypes = Reflect.getMetadata('design:paramtypes', type) || [];

        var types = paramtypes.map((x: any) => x.name);
        var injectableOverrides = Reflect.getMetadata('npie:injectables', type);

        for(var key in injectableOverrides) {
            types[key] = injectableOverrides[key];
        }

        var args: any[] = [null];

        for(var i = 0; i < types.length; i++) {
            var argType = types[i];
            var arg = this.get(argType);

            args.push(arg);
        }

        return new ((<any>type).bind.apply(type, args));
    }
}