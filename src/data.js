// @flow strict

import { List, Record } from "immutable"
import type { RecordFactory } from "immutable"

import type { ProjectDTO, TaskDTO, TodoDTO } from "./dtos.js"

export { ProjectStatus, TaskStatus } from "./dtos.js"

export const Credentials: RecordFactory<{ username: string, password: string }> = Record({
	username: "", password: "",
})

export enum ReorderPosition {
	Before, After
}

const defaultTask: TaskDTO = {
	id: undefined,
	name: "",
	description: "",
	sortOrder: undefined,
	status: undefined,
	project: undefined,
}
export const Task: RecordFactory<TaskDTO> = Record(defaultTask)

const defaultProject: ProjectDTO = {
	id: undefined,
	name: "",
	description: "",
	status: undefined,
	tasks: undefined,
}
export const Project: RecordFactory<{
	...ProjectDTO,
	tasks?: ?List<Task>,
}> = Record(defaultProject)

const defaultTodo: TodoDTO = {
	project: defaultProject,
	task: undefined,
}
export const Todo: RecordFactory<{
	project: Project,
	task?: ?Task,
}> = Record(defaultTodo)
