// @flow strict

import { v4 as uuid } from "uuid"

import { Project, Task, Todo } from "../data.js"
import { get, post } from "./http.js"
import { parseTodo } from "./parsers.js"
import { fetchProjects } from "./projects.js"

import type { TaskDTO, TaskUpdateDTO, TodoDTO, UpdateTodoDTO } from "../dtos.js"
import typeof { TaskStatus } from "../dtos.js"
import type { AppThunkAction } from "./types.js"

type CurrentTodoWillLoadAction = {
	type: "CURRENT_TODO_WILL_LOAD",
	requestID: string,
}
type CurrentTodoDidLoadAction = {
	type: "CURRENT_TODO_DID_LOAD",
	todo: Todo,
	requestID: string,
}
type CurrentTodoWillUpdateAction = {
	type: "CURRENT_TODO_WILL_UPDATE",
	todoUpdate: UpdateTodoDTO,
	requestID: string,
}
type CurrentTodoDidUpdateAction = {
	type: "CURRENT_TODO_DID_UPDATE",
	todo: Todo,
	requestID: string,
}

export type TodoAction =
	| CurrentTodoWillLoadAction
	| CurrentTodoDidLoadAction
	| CurrentTodoWillUpdateAction
	| CurrentTodoDidUpdateAction

export function fetchCurrentTodo() : AppThunkAction {
	return async(dispatch, getState) => {
		const { credentials, currentTodo } = getState()
		if(credentials == null) return

		const requestID = uuid()

		dispatch({ type: "CURRENT_TODO_WILL_LOAD", requestID })
		const json: TodoDTO = await get("/todo", credentials)
		dispatch({
			type: "CURRENT_TODO_DID_LOAD",
			todo: parseTodo(json),
			requestID,
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

		const requestID = uuid()

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

		dispatch({
			type: "CURRENT_TODO_WILL_UPDATE",
			todoUpdate: updateDTO,
			requestID,
		})

		const json: TodoDTO = await post("/todo", updateDTO, credentials)

		dispatch({
			type: "CURRENT_TODO_DID_UPDATE",
			todo: parseTodo(json),
			requestID,
		})

		dispatch(fetchProjects())
	}
}
