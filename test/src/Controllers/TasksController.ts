
import { Controller, Get, Post, Put, Delete, Body } from "../../../npie";

import { BaseEntityController } from './BaseEntityController';
import { Task } from "../Entities/Task";
import { TaskService } from "../Services/TaskService";
import { SearchResult } from '../Views/SearchResult';

import { Authorize } from '../Decorators/Authorize';
import { AuthenticationType } from "../Enums/AuthenticationType";
import { AuthorizationRole } from "../Enums/AuthorizationRole";

@Controller('Tasks')
export class TasksController extends BaseEntityController<Task> {

    public constructor(private taskService: TaskService) {
        super(taskService);
    }

    // All Access

    @Get()
    public async getAll() : Promise<Task[]> {
        return super.getAll();
    }

    // Requires Auth of any kind

    @Get(':id')
    public async get(id: number) : Promise<Task> {
        console.log(id);
        return super.get(id);
    }

    // Requires Auth of any kind

    @Post()
    @Authorize()
    public async add(@Body() entity: Task) : Promise<Task> {
        return super.add(entity);
    }

    // Requires Admin Auth

    @Put(':id')
    @Authorize()
    public async update(id: number, @Body() entity: Task) : Promise<void> {
        await super.update(id, entity);
    }

    @Put(':id/status/:status')
    @Authorize()
    public async updateStatus(id: number, status: string) : Promise<void> {
        await this.taskService.updateStatus(id, status);
    }

    // Requires Admin Auth and the Owner Role

    @Delete(':id')
    @Authorize()
    public async delete(id: number) : Promise<void> {
        return super.delete(id);
    }
    
}