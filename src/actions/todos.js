// @flow strict

import { Project, Task, Todo } from "../data.js"
import { get, post } from "./http.js"
import { parseTodo } from "./parsers.js"
import { fetchProjects } from "./projects.js"

import type { TaskDTO, TaskUpdateDTO, TodoDTO, UpdateTodoDTO } from "../dtos.js"
import typeof { TaskStatus } from "../dtos.js"
import type { AppThunkAction } from "./types.js"

type CurrentTodoWillLoadAction = {
	type: "CURRENT_TODO_WILL_LOAD",
}
type CurrentTodoDidLoadAction = {
	type: "CURRENT_TODO_DID_LOAD",
	todo: Todo,
}

export type TodoAction =
	| CurrentTodoWillLoadAction
	| CurrentTodoDidLoadAction

export function fetchCurrentTodo() : AppThunkAction {
	return async(dispatch, getState) => {
		const { credentials, currentTodo } = getState()
		if(credentials == null) return

		dispatch({ type: "CURRENT_TODO_WILL_LOAD" })
		const json: TodoDTO = await get("/todo", credentials)
		dispatch({
			type: "CURRENT_TODO_DID_LOAD",
			todo: parseTodo(json),
		})
	}
}

export function changeCurrentTodo(taskStatus: ?$Keys<TaskStatus>) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials, currentTodo } = getState()
		if(credentials == null) return

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
		const json: TodoDTO = await post("/todo", updateDTO, credentials)

		dispatch({
			type: "CURRENT_TODO_DID_LOAD",
			todo: parseTodo(json),
		})

		dispatch(fetchProjects())
	}
}
