// @flow strict

import { v4 as uuid } from "uuid"

import { Project } from "../data.js"
import { del, post, get, put } from "./http.js"
import { parseProject } from "./parsers.js"

import type {
	AccessTokenResponse, ErrorResponse,
	ProfileDTO, ProjectDTO, TaskDTO, TodoDTO, UpdateTodoDTO, TaskUpdateDTO, UUID,
} from "../dtos.js"
import type { AppThunkAction } from "./types.js"

type ProjectsWillLoadAction = {
	type: "PROJECTS_WILL_LOAD",
	requestID: string,
}
type ProjectsDidLoadAction = {
	type: "PROJECTS_DID_LOAD",
	projects: $ReadOnlyArray<Project>,
	requestID: string,
}
type CreateProjectWillSaveAction = {
	type: "CREATE_PROJECT_WILL_SAVE",
	project: Project,
	temporaryID: UUID,
	requestID: string,
}
type CreateProjectDidSaveAction = {
	type: "CREATE_PROJECT_DID_SAVE",
	project: Project,
	temporaryID: UUID,
	requestID: string,
}
type UpdateProjectWillSaveAction = {
	type: "UPDATE_PROJECT_WILL_SAVE",
	project: Project,
	requestID: string,
}
type UpdateProjectDidSaveAction = {
	type: "UPDATE_PROJECT_DID_SAVE",
	project: Project,
	requestID: string,
}
type DeleteProjectWillSaveAction = {
	type: "DELETE_PROJECT_WILL_SAVE",
	project: Project,
	requestID: string,
}
type DeleteProjectDidSaveAction = {
	type: "DELETE_PROJECT_DID_SAVE",
	project: Project,
	requestID: string,
}
export type ProjectAction =
	| ProjectsWillLoadAction
	| ProjectsDidLoadAction
	| CreateProjectWillSaveAction
	| CreateProjectDidSaveAction
	| UpdateProjectWillSaveAction
	| UpdateProjectDidSaveAction
	| DeleteProjectWillSaveAction
	| DeleteProjectDidSaveAction

export function createProject(project: Project, onSuccess?: (Project) => void) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials } = getState()
		if(credentials == null) return

		const tempID = "temp-id"
		const requestID = uuid()

		dispatch({
			type: "CREATE_PROJECT_WILL_SAVE",
			temporaryID: tempID,
			project: project
				.set("id", tempID),
			requestID,
		})

		const json: ProjectDTO = await post(`/projects`, project.toJSON(), credentials)
		const savedProject = parseProject(json)

		dispatch({
			type: "CREATE_PROJECT_DID_SAVE",
			temporaryID: tempID,
			project: savedProject,
			requestID,
		})

		onSuccess?.(savedProject)
	}
}

export function deleteProject(project: Project) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials } = getState()
		if(credentials == null) return

		const requestID = uuid()
		const projectID = project.get("id")

		if(projectID == null) {
			throw new Error("Project needs ID before it can be deleted")
		}

		dispatch({
			type: "DELETE_PROJECT_WILL_SAVE",
			project,
			requestID,
		})

		await del(`/projects/${projectID}`, credentials)

		dispatch({
			type: "DELETE_PROJECT_DID_SAVE",
			project,
			requestID,
		})
	}
}

export function fetchProjects() : AppThunkAction {
	return async(dispatch, getState) => {
		const { credentials, currentTodo } = getState()
		if(credentials == null) return
		const requestID = uuid()

		dispatch({
			type: "PROJECTS_WILL_LOAD",
			requestID,
		})
		const json: $ReadOnlyArray<ProjectDTO> = await get("/projects", credentials)
		dispatch({
			type: "PROJECTS_DID_LOAD",
			projects: json.map(parseProject),
			requestID,
		})
	}
}

export function updateProject(project: Project) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials } = getState()
		if(credentials == null) return

		const requestID = uuid()
		const projectID = project.get("id")

		if(projectID == null) {
			throw new Error("Project needs ID before it can be updated")
		}

		dispatch({
			type: "UPDATE_PROJECT_WILL_SAVE",
			project,
			requestID,
		})

		const json: ProjectDTO = await put(`/projects/${projectID}`, project.toJSON(), credentials)

		dispatch({
			type: "UPDATE_PROJECT_DID_SAVE",
			project: parseProject(json),
			requestID,
		})
	}
}
