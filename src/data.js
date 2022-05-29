// @flow strict

import { List, Record } from "immutable"
import type { RecordFactory } from "immutable"

import type { ProfileDTO, ProjectDTO, TaskDTO, TodoDTO } from "./dtos.js"

export { ProjectStatus, TaskStatus } from "./dtos.js"

export const Credentials: RecordFactory<{
	accessTokenExpiration: string,
	type: "mac"|"bearer",
	accessToken: string,
	refreshToken?: ?string,
}> = Record({
	accessTokenExpiration: "",
	accessToken: "",
	type: "bearer",
	refreshToken: null,
})

export enum ReorderPosition {
	Before, After
}

const defaultProfile: ProfileDTO = {
	name: "",
	username: "",
}
export const Profile: RecordFactory<ProfileDTO> = Record(defaultProfile)

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
