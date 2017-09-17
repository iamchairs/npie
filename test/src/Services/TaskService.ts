import { Model } from "sequelize";

import { Injectable } from '../../../npie';

import { Task } from "../Entities/Task";
import { BaseEntityService } from "./BaseEntityService";
import { SearchRequest } from "../Views/SearchRequest";
import { SearchResult } from "../Views/SearchResult";

@Injectable()
export class TaskService extends BaseEntityService<Task> {

    public async updateStatus(id: number, status: string) {
        let tasks = await super.getAll();
        let idx = tasks.findIndex(x => x.id === id);

        tasks[idx].status = <any>status;
    }

}