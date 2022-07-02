// @flow strict

import { del, post, get, put } from "./http.js"
import { Task } from "../data.js"

import type {
	TaskDTO, TaskUpdateDTO, UUID,
} from "../dtos.js"
import type { AppThunkAction } from "./types.js"

type CreateTaskWillSaveAction = {
	type: "CREATE_TASK_WILL_SAVE",
	projectID: string,
	task: Task,
	temporaryID: UUID,
}
type CreateTaskDidSaveAction = {
	type: "CREATE_TASK_DID_SAVE",
	task: Task,
	temporaryID: UUID,
}
type UpdateTaskWillSaveAction = {
	type: "UPDATE_TASK_WILL_SAVE",
	task: Task,
}
type UpdateTaskDidSaveAction = {
	type: "UPDATE_TASK_DID_SAVE",
	task: Task,
}
type DeleteTaskWillSaveAction = {
	type: "DELETE_TASK_WILL_SAVE",
	task: Task,
}
type DeleteTaskDidSaveAction = {
	type: "DELETE_TASK_DID_SAVE",
	task: Task,
}
export type TaskAction =
	| CreateTaskWillSaveAction
	| CreateTaskDidSaveAction
	| UpdateTaskWillSaveAction
	| UpdateTaskDidSaveAction
	| DeleteTaskWillSaveAction
	| DeleteTaskDidSaveAction

export function createTask(projectID: string, task: Task) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials } = getState()
		if(credentials == null) return

		const project = getState().projects?.find(x => x.get("id") === projectID)

		if(project == null) {
			throw new Error("Project must exist")
		}

		const highestSortOrder = project.get("tasks")?.map(x => x.get("sortOrder") ?? 0).sort().last() ?? 0

		const tempID = "temp-id"

		dispatch({
			type: "CREATE_TASK_WILL_SAVE",
			projectID,
			temporaryID: tempID,
			task: task
				.set("id", tempID)
				.set("project", projectID)
				.set("sortOrder", highestSortOrder + 1),
		})

		const json: TaskDTO = await post(`/projects/${projectID}/tasks`, task.toJSON(), credentials)

		dispatch({
			type: "CREATE_TASK_DID_SAVE",
			temporaryID: tempID,
			task: new Task(json),
		})
	}
}

export function deleteTask(task: Task) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials } = getState()
		if(credentials == null) return

		const taskID = task.get("id")
		const projectID = task.get("project")

		if(taskID == null) {
			throw new Error("Task needs ID before it can be deleted")
		}

		if(projectID == null) {
			throw new Error("Task needs project ID before it can be deleted")
		}

		dispatch({
			type: "DELETE_TASK_WILL_SAVE",
			task,
		})

		await del(`/projects/${projectID}/tasks/${taskID}`, credentials)

		dispatch({
			type: "DELETE_TASK_DID_SAVE",
			task,
		})
	}
}

export function updateTask(task: Task) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials } = getState()
		if(credentials == null) return

		const taskID = task.get("id")
		const projectID = task.get("project")

		if(taskID == null) {
			throw new Error("Task needs ID before it can be updated")
		}

		if(projectID == null) {
			throw new Error("Task needs project ID before it can be updated")
		}

		dispatch({
			type: "UPDATE_TASK_WILL_SAVE",
			task: task,
		})

		const json: TaskDTO = await put(`/projects/${projectID}/tasks/${taskID}`, task.toJSON(), credentials)

		dispatch({
			type: "UPDATE_TASK_DID_SAVE",
			task: new Task(json),
		})
	}
}
