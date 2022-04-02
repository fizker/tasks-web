// @flow strict

import { List } from "immutable"

import type { ThunkAction } from "redux-thunk"

import type { ProjectDTO, TaskDTO, TodoDTO, UpdateTodoDTO, TaskUpdateDTO, UUID } from "./dtos.js"
import type { State } from "./store.js"

import { TaskStatus } from "./dtos.js"
import { Project, Task, Todo } from "./data.js"

// TODO: All HTTP functions should use this, not just delete
async function parseJSONResponse<T>(response: Response) : Promise<?T> {
	if(response.headers.get("content-type")?.startsWith("application/json")) {
		const json: T = await response.json()
		return json
	} else {
		return null
	}
}

async function get<T>(path: string) : Promise<T> {
	const response = await fetch(`${SERVER_URL}${path}`)
	const json: T = await response.json()
	return json
}

/// Note: This is called `del` because `delete` is a keyword.
async function del<T>(path: string) : Promise<?T> {
	const response = await fetch(`${SERVER_URL}${path}`, {
		method: "DELETE",
	})
	return parseJSONResponse(response)
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

async function put<ResponseDTO, UpdateDTO>(path: string, data: UpdateDTO) : Promise<ResponseDTO> {
	const body = JSON.stringify(data)
	const response = await fetch(`${SERVER_URL}${path}`, {
		method: "PUT",
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
type CreateProjectWillSaveAction = {
	type: "CREATE_PROJECT_WILL_SAVE",
	project: Project,
	temporaryID: UUID,
}
type CreateProjectDidSaveAction = {
	type: "CREATE_PROJECT_DID_SAVE",
	project: Project,
	temporaryID: UUID,
}
type UpdateProjectWillSaveAction = {
	type: "UPDATE_PROJECT_WILL_SAVE",
	project: Project,
}
type UpdateProjectDidSaveAction = {
	type: "UPDATE_PROJECT_DID_SAVE",
	project: Project,
}
type DeleteProjectWillSaveAction = {
	type: "DELETE_PROJECT_WILL_SAVE",
	project: Project,
}
type DeleteProjectDidSaveAction = {
	type: "DELETE_PROJECT_DID_SAVE",
	project: Project,
}
type ProjectsAction =
	| ProjectsWillLoadAction
	| ProjectsDidLoadAction
	| CreateProjectWillSaveAction
	| CreateProjectDidSaveAction
	| UpdateProjectWillSaveAction
	| UpdateProjectDidSaveAction
	| DeleteProjectWillSaveAction
	| DeleteProjectDidSaveAction

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
type TaskAction =
	| CreateTaskWillSaveAction
	| CreateTaskDidSaveAction
	| UpdateTaskWillSaveAction
	| UpdateTaskDidSaveAction
	| DeleteTaskWillSaveAction
	| DeleteTaskDidSaveAction


export type Action =
	| ReduxInitAction
	| ProjectsAction
	| CurrentTodoAction
	| TaskAction

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

export function createProject(project: Project, onSuccess?: (Project) => void) : AppThunkAction {
	return async (dispatch, getState) => {
		const tempID = "temp-id"

		dispatch({
			type: "CREATE_PROJECT_WILL_SAVE",
			temporaryID: tempID,
			project: project
				.set("id", tempID),
		})

		const json: ProjectDTO = await post(`/projects`, project.toJSON())
		const savedProject = parseProject(json)

		dispatch({
			type: "CREATE_PROJECT_DID_SAVE",
			temporaryID: tempID,
			project: savedProject,
		})

		onSuccess?.(savedProject)
	}
}

export function deleteProject(project: Project) : AppThunkAction {
	return async (dispatch, getState) => {
		const projectID = project.get("id")

		if(projectID == null) {
			throw new Error("Project needs ID before it can be deleted")
		}

		dispatch({
			type: "DELETE_PROJECT_WILL_SAVE",
			project,
		})

		await del(`/projects/${projectID}`)

		dispatch({
			type: "DELETE_PROJECT_DID_SAVE",
			project,
		})
	}
}

export function updateProject(project: Project) : AppThunkAction {
	return async (dispatch, getState) => {
		const projectID = project.get("id")

		if(projectID == null) {
			throw new Error("Project needs ID before it can be updated")
		}

		dispatch({
			type: "UPDATE_PROJECT_WILL_SAVE",
			project,
		})

		const json: ProjectDTO = await put(`/projects/${projectID}`, project.toJSON())

		dispatch({
			type: "UPDATE_PROJECT_DID_SAVE",
			project: parseProject(json),
		})
	}
}

export function createTask(projectID: string, task: Task) : AppThunkAction {
	return async (dispatch, getState) => {
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

		const json: TaskDTO = await post(`/projects/${projectID}/tasks`, task.toJSON())

		dispatch({
			type: "CREATE_TASK_DID_SAVE",
			temporaryID: tempID,
			task: new Task(json),
		})
	}
}

export function deleteTask(task: Task) : AppThunkAction {
	return async (dispatch, getState) => {
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

		await del(`/projects/${projectID}/tasks/${taskID}`)

		dispatch({
			type: "DELETE_TASK_DID_SAVE",
			task,
		})
	}
}

export function updateTask(task: Task) : AppThunkAction {
	return async (dispatch, getState) => {
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

		const json: TaskDTO = await put(`/projects/${projectID}/tasks/${taskID}`, task.toJSON())

		dispatch({
			type: "UPDATE_TASK_DID_SAVE",
			task: new Task(json),
		})
	}
}
