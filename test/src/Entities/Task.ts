import { BaseEntity } from "./BaseEntity";

export class Task extends BaseEntity {
    public name: string;

    public status: 'inprogress' | 'completed';
}