// @flow strict

import { Record } from "immutable"
import type { RecordFactory, RecordOf } from "immutable"

import type { ProjectDTO, TaskDTO, TodoDTO } from "./dtos.js"

const defaultTask: TaskDTO = {
	id: undefined,
	name: "",
	description: "",
	sortOrder: undefined,
	status: undefined,
	project: undefined,
}
const TaskRecord: RecordFactory<TaskDTO> = Record(defaultTask)
export class Task extends TaskRecord {
}

const defaultProject: ProjectDTO = {
	id: undefined,
	name: "",
	description: "",
	status: undefined,
	tasks: undefined,
}
const ProjectRecord: RecordFactory<{
	...ProjectDTO,
	tasks?: ?$ReadOnlyArray<Task>,
}> = Record(defaultProject)
export class Project extends ProjectRecord {
}

const defaultTodo: TodoDTO = {
	project: defaultProject,
	task: undefined,
}
const TodoRecord: RecordFactory<{
	project: Project,
	task?: ?Task,
}> = Record(defaultTodo)

export class Todo extends TodoRecord {
}
