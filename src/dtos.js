// @flow strict

export type UUID = string

type TaskStatus = "notStarted" | "done"

export type TaskDTO = {
	id?: ?UUID,
	name: string,
	description: string,
	sortOrder?: ?number,
	status?: ?TaskStatus,
	project?: ?UUID,
}

type ProjectStatus = "active" | "onHold"

export type ProjectDTO = {
	id?: ?UUID,
	name: string,
	description: string,
	status?: ?ProjectStatus,
	tasks?: ?Array<TaskDTO>,
}

export type TodoDTO = {
	project: ProjectDTO,
	task?: ?TaskDTO,
}

type TaskUpdate = {
	id: UUID,
	status: TaskStatus,
}

export type UpdateTodoDTO = {
	project: UUID,
	projectStatus?: ?ProjectStatus,
	task?: ?TaskUpdate,
}
