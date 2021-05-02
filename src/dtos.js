// @flow strict

export type UUID = string

export const TaskStatus = {
	"notStarted": "notStarted",
	"done": "done",
}

export type TaskDTO = {
	id?: ?UUID,
	name: string,
	description: string,
	sortOrder?: ?number,
	status?: ?$Keys<typeof TaskStatus>,
	project?: ?UUID,
}

export const ProjectStatus = {
	"active": "active",
	"onHold": "onHold",
}

export type ProjectDTO = {
	id?: ?UUID,
	name: string,
	description: string,
	status?: ?$Keys<typeof ProjectStatus>,
	tasks?: ?$ReadOnlyArray<TaskDTO>,
}

export type TodoDTO = {
	project: ProjectDTO,
	task?: ?TaskDTO,
}

export type TaskUpdateDTO = {
	id: UUID,
	status: $Keys<typeof TaskStatus>,
}

export type UpdateTodoDTO = {
	project: UUID,
	projectStatus?: ?$Keys<typeof ProjectStatus>,
	task?: ?TaskUpdateDTO,
}
