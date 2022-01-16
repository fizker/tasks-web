// @flow strict

import { List } from "immutable"

import type { ThunkAction } from "redux-thunk"

import type { ProjectDTO, TodoDTO, UpdateTodoDTO, TaskUpdateDTO } from "./dtos.js"
import type { State } from "./store.js"

import { TaskStatus } from "./dtos.js"
import { Project, Task, Todo } from "./data.js"

async function get<T>(path: string) : Promise<T> {
	const response = await fetch(`${SERVER_URL}${path}`)
	const json: T = await response.json()
	return json
}

async function post<ResponseDTO, UpdateDTO = void>(path: string, data?: UpdateDTO) : Promise<ResponseDTO> {
	const body = data == null ? null : JSON.stringify(data)
	const response = await fetch(`${SERVER_URL}${path}`, {
		method: "POST",
		body,
		headers: {
			"content-type": "application/json",
		},
	})
	const json: ResponseDTO = await response.json()
	return json
}

type ReduxInitAction = { type: "INIT" }

type ProjectsWillLoadAction = {
	type: "PROJECTS_WILL_LOAD",
}
type ProjectsDidLoadAction = {
	type: "PROJECTS_DID_LOAD",
	projects: $ReadOnlyArray<Project>,
}
type ProjectsAction =
	| ProjectsWillLoadAction
	| ProjectsDidLoadAction

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
	| ProjectsAction
	| CurrentTodoAction

export type DispatchAction =
	| AppThunkAction
	| Action

type AppThunkAction = ThunkAction<State, DispatchAction>

function parseProject(dto: ProjectDTO): Project {
	const tasks = dto.tasks?.map(x => new Task(x))
	return new Project({
		...dto,
		tasks: tasks ? List(tasks) : tasks,
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
	dispatch({
		type: "PROJECTS_WILL_LOAD",
	})
	const json: $ReadOnlyArray<ProjectDTO> = await get("/projects")
	dispatch({
		type: "PROJECTS_DID_LOAD",
		projects: json.map(parseProject),
	})
}

export const fetchCurrentTodo: AppThunkAction = async(dispatch) => {
	dispatch({ type: "CURRENT_TODO_WILL_LOAD" })
	const json: TodoDTO = await get("/todo")
	dispatch({
		type: "CURRENT_TODO_DID_LOAD",
		todo: parseTodo(json),
	})
}

export function changeCurrentTodo(taskStatus: ?$Keys<typeof TaskStatus>) : AppThunkAction {
	return async (dispatch, getState) => {
		const { currentTodo } = getState()

		if(currentTodo == null) {
			throw new Error("CurrentTodo must be loaded before it can be updated")
		}

		let taskUpdate: ?TaskUpdateDTO
		if(taskStatus != null) {
			const task = currentTodo.get("task")
			if(task == null) {
				throw new Error("CurrentTodo must have a Task before it can be updated")
			}

			taskUpdate = {
				id: task.get("id") ?? "",
				status: taskStatus,
			}
		}

		const updateDTO: UpdateTodoDTO = {
			project: currentTodo.get("project").get("id") ?? "",
			task: taskUpdate,
		}
		const json: TodoDTO = await post("/todo", updateDTO)

		dispatch({
			type: "CURRENT_TODO_DID_LOAD",
			todo: parseTodo(json),
		})

		dispatch(fetchProjects)
	}
}
