import 'reflect-metadata';
export declare class Container {
    private map;
    register(type: Function | string, concrete?: Function): void;
    singleton(type: Function | string, entity: any): void;
    get(type: Function): any;
    getInjected<T>(type: T): any;
}
