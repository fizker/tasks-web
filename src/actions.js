// @flow strict

import type { ThunkAction } from "redux-thunk"

import type { ProjectDTO, TodoDTO } from "./dtos.js"
import type { State } from "./store.js"

import { Project, Task, Todo } from "./data.js"

type ReduxInitAction = { type: "INIT" }
type ProjectsLoadedAction = {
	type: "PROJECTS_LOADED",
	projects: $ReadOnlyArray<Project>,
}

type CurrentTodoWillLoadAction = {
	type: "CURRENT_TODO_WILL_LOAD",
}
type CurrentTodoDidLoadAction = {
	type: "CURRENT_TODO_DID_LOAD",
	todo: Todo,
}

type CurrentTodoAction =
	| CurrentTodoWillLoadAction
	| CurrentTodoDidLoadAction

export type Action =
	| ReduxInitAction
	| ProjectsLoadedAction
	| CurrentTodoAction

type AppThunkAction = ThunkAction<State, Action>

export type DispatchAction =
	| AppThunkAction
	| Action

function parseProject(dto: ProjectDTO): Project {
	return new Project({
		...dto,
		tasks: dto.tasks?.map(x => new Task(x)),
	})
}

function parseTodo(dto: TodoDTO) : Todo {
	return new Todo({
		...dto,
		project: parseProject(dto.project),
		task: dto.task ? new Task(dto.task) : null,
	})
}

export const fetchProjects: AppThunkAction = async(dispatch) => {
	const response = await fetch(`${SERVER_URL}/projects`)
	const json: $ReadOnlyArray<ProjectDTO> = await response.json()
	dispatch({
		type: "PROJECTS_LOADED",
		projects: json.map(parseProject),
	})
}

export const fetchCurrentTodo: AppThunkAction = async(dispatch) => {
	dispatch({ type: "CURRENT_TODO_WILL_LOAD" })
	const response = await fetch(`${SERVER_URL}/todo`)
	const json: TodoDTO = await response.json()
	dispatch({
		type: "CURRENT_TODO_DID_LOAD",
		todo: parseTodo(json),
	})
}
