import { HttpResponse } from '../../../npie/Server/HttpResponse';

import { SearchRequest } from "../Views/SearchRequest";
import { SearchResult } from "../Views/SearchResult";
import { IEntityService } from "../Services/IEntityService";
import { BaseEntity } from "../Entities/BaseEntity";

export abstract class BaseEntityController<T extends BaseEntity> {
    public constructor(protected service: IEntityService<T>) { }

    public async getAll(): Promise<T[]> {
        return this.service.getAll();
    }

    public async get(id: number): Promise<T> {
        return this.service.get(id);
    }

    public async update(id: number, entity: T) {
        await this.service.update(id, entity);
    }

    public async add(entity: T): Promise<T> {
        return this.service.add(entity);
    }

    public async delete(id: number) {
        await this.service.delete(id);
    }

    protected ok(message: any) {
        return new HttpResponse(200, message);
    }

    protected noContent() {
        return new HttpResponse(204);
    }

    protected error(message: any = 'Internal Server Error') {
        return new HttpResponse(500, message);
    }

    protected unauthenticated(message: any = 'Unauthenticated') {
        return new HttpResponse(401, message);
    }

    protected unauthorized(message: any = 'Unauthorized') {
        return new HttpResponse(403, message);
    }

    protected badRequest(message: any = 'Bad Request') {
        return new HttpResponse(400, message);
    }
}