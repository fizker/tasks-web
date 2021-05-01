// @flow strict

import { useDispatch, useSelector } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import { Project, Task, Todo } from "./data.js"

import type { Store, DispatchAPI } from "redux"
import type { ThunkAction } from "redux-thunk"
import type { ProjectDTO, TodoDTO } from "./dtos.js"

type State = {
	projects: ?$ReadOnlyArray<Project>,
	currentTodo?: ?Todo,
}

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

type Action =
	| ReduxInitAction
	| ProjectsLoadedAction
	| CurrentTodoAction

type AppThunkAction<A: Action, ReturnValue = Promise<void>> = ThunkAction<State, A, ReturnValue>

type DispatchAction =
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

const defaultState: State = {
	projects: null,
}

function reducer(state?: State = defaultState, action: Action) : State {
	switch(action.type) {
	case "PROJECTS_LOADED":
		return {
			...state,
			projects: action.projects,
		}
	case "CURRENT_TODO_WILL_LOAD":
		return {
			...state,
			currentTodo: null,
		}
	case "CURRENT_TODO_DID_LOAD":
		return {
			...state,
			currentTodo: action.todo,
		}
	case "INIT":
		// Don't do anything here. Redux does not always actually call it INIT
		return state
	default:
		(action: empty)
		return state
	}
}

export const store: Store<State, Action, DispatchAPI<DispatchAction>> = createStore(reducer, applyMiddleware(thunkMiddleware))
export function useAppDispatch() : DispatchAPI<DispatchAction> { return useDispatch() }
export function useAppSelector<T>(fn: (State) => T, eq?: (T, T) => boolean) : T { return useSelector(fn, eq) }
