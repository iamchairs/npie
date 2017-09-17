import { BaseEntity } from "../Entities/BaseEntity";
import { IEntityService } from "./IEntityService";
import { SearchRequest } from "../Views/SearchRequest";
import { Model, Transaction } from "sequelize";
import { SearchResult } from "../Views/SearchResult";

/**
 * This is for the test sample. You shouldn't implement a datastore like this
 */
const dataStore: any[] = [];

export class BaseEntityService<T extends BaseEntity> implements IEntityService<T> {
    public constructor() {}

    public async getAll(): Promise<T[]> {
        return dataStore;
    }

    public async get(id: number): Promise<T> {
        return dataStore.filter((x : BaseEntity) => x.id === id)[0];
    }

    public async update(id: number, entity: T, t?: Transaction) {
        let idx = dataStore.findIndex((x: BaseEntity) => x.id === id);
        
        entity.id = id;

        Object.assign(dataStore[idx], entity, dataStore[idx]);
    }

    public async add(entity: T, t?: Transaction): Promise<T> {
        entity.id = dataStore.length + 1;
        dataStore.push(entity);

        return entity;
    }

    public async delete(id: number, t?: Transaction) {
        let idx = dataStore.findIndex((x: BaseEntity) => x.id === id);
        dataStore.splice(idx, 1);
    }
}