import { SearchResult } from "../Views/SearchResult";
import { SearchRequest } from "../Views/SearchRequest";
import { BaseEntity } from "../Entities/BaseEntity";
import { Transaction } from "sequelize";

export interface IEntityService<T extends BaseEntity> {
    getAll(): Promise<T[]>;

    get(id: number): Promise<T>;

    update(id: number, entity: T, t?: Transaction): Promise<any>;

    add(entity: T, t?: Transaction): Promise<T>;

    delete(id: number, t?: Transaction): Promise<any>;
}