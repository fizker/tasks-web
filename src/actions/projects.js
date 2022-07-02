// @flow strict

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

		dispatch({
			type: "CREATE_PROJECT_WILL_SAVE",
			temporaryID: tempID,
			project: project
				.set("id", tempID),
		})

		const json: ProjectDTO = await post(`/projects`, project.toJSON(), credentials)
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
		const { credentials } = getState()
		if(credentials == null) return

		const projectID = project.get("id")

		if(projectID == null) {
			throw new Error("Project needs ID before it can be deleted")
		}

		dispatch({
			type: "DELETE_PROJECT_WILL_SAVE",
			project,
		})

		await del(`/projects/${projectID}`, credentials)

		dispatch({
			type: "DELETE_PROJECT_DID_SAVE",
			project,
		})
	}
}

export function fetchProjects() : AppThunkAction {
	return async(dispatch, getState) => {
		const { credentials, currentTodo } = getState()
		if(credentials == null) return

		dispatch({
			type: "PROJECTS_WILL_LOAD",
		})
		const json: $ReadOnlyArray<ProjectDTO> = await get("/projects", credentials)
		dispatch({
			type: "PROJECTS_DID_LOAD",
			projects: json.map(parseProject),
		})
	}
}

export function updateProject(project: Project) : AppThunkAction {
	return async (dispatch, getState) => {
		const { credentials } = getState()
		if(credentials == null) return

		const projectID = project.get("id")

		if(projectID == null) {
			throw new Error("Project needs ID before it can be updated")
		}

		dispatch({
			type: "UPDATE_PROJECT_WILL_SAVE",
			project,
		})

		const json: ProjectDTO = await put(`/projects/${projectID}`, project.toJSON(), credentials)

		dispatch({
			type: "UPDATE_PROJECT_DID_SAVE",
			project: parseProject(json),
		})
	}
}
