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

type AppThunkAction<A: Action, ReturnValue = Promise<void>> = ThunkAction<State, A, ReturnValue>

export type DispatchAction =
	| AppThunkAction<Action>
	| Action

function parseProject(dto: ProjectDTO): Project {
	return new Project({
		...dto,
		tasks: dto.tasks?.map(x => new Task(x)),
	})
}

export const fetchProjects: AppThunkAction<ProjectsLoadedAction> = async(dispatch) => {
	const response = await fetch(`${SERVER_URL}/projects`)
	const json: $ReadOnlyArray<ProjectDTO> = await response.json()
	dispatch({
		type: "PROJECTS_LOADED",
		projects: json.map(parseProject),
	})
}

export const fetchCurrentTodo: AppThunkAction<CurrentTodoDidLoadAction> = async(dispatch) => {
	//dispatch({ type: "CURRENT_TODO_WILL_LOAD" })
	const response = await fetch(`${SERVER_URL}/todo`)
	const json: TodoDTO = await response.json()
	dispatch({
		type: "CURRENT_TODO_DID_LOAD",
		todo: new Todo({
			...json,
			project: parseProject(json.project),
			task: json.task ? new Task(json.task) : null,
		}),
	})
}
