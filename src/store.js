// @flow strict

import { List } from "immutable"
import { useDispatch, useSelector } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import { updateNetworkRequest, createNetworkRequest, upsertNetworkRequest } from "./actions.js"
import {
	Credentials, Profile,
	Project, Task, Todo,
} from "./data.js"

import type { Store, DispatchAPI } from "redux"
import type { Action, DispatchAction, NetworkRequest } from "./actions.js"

export type State = $ReadOnly<{
	projects: ?List<Project>,
	currentTodo?: ?Todo,
	credentials?: ?Credentials,
	profile?: ?Profile,
	networkRequests: List<NetworkRequest>,
}>

const defaultState: State = {
	projects: null,
	credentials: loadStoredCredentials(),
	networkRequests: new List,
}

function loadStoredCredentials() : Credentials|null {
	const json = sessionStorage.getItem("credentials")
	if(json == null) {
		return null
	}

	const data = JSON.parse(json)
	const { accessToken, refreshToken, accessTokenExpiration, type } = data

	return new Credentials({
		type,
		accessTokenExpiration,
		accessToken,
		refreshToken,
	})
}
function updateStoredCredentials(creds: Credentials|null) {
	if(creds == null) {
		sessionStorage.removeItem("credentials")
		return
	}

	const data = creds.toJSON()
	const json = JSON.stringify(data)
	sessionStorage.setItem("credentials", json)
}

function updateProject(projects: List<Project>, project: Project, projectID = project.get("id")) {
	const pidx = projects.findIndex(x => x.get("id") === projectID)

	if(pidx === -1) {
		return projects
	}

	return projects.set(pidx, project)
}

function deleteTaskInProject(projects: List<Project>, task: Task) {
	const pentry = projects.findEntry(x => x.get("id") === task.get("project"))
	if(pentry == null) return projects
	const [ pidx, project ] = pentry
	const orgTasks = project.get("tasks") ?? new List
	const tidx = orgTasks.findIndex(x => x.get("id") === task.get("id"))

	// Nothing to delete
	if(tidx === -1) {
		return projects
	}

	return projects.set(
		pidx,
		project.set(
			"tasks",
			orgTasks.delete(tidx),
		),
	)
}

function updateTaskInProject(projects: List<Project>, task: Task, taskID = task.get("id")) {
	const pentry = projects.findEntry(x => x.get("id") === task.get("project"))
	if(pentry == null) return projects
	const [ pidx, project ] = pentry
	let tasks = project.get("tasks") ?? new List

	tasks = updateTaskSortOrder(tasks, task)
	const tidx = tasks.findIndex(x => x.get("id") === taskID)

	// No task to update
	if(tidx === -1) {
		return projects
	}

	tasks = tasks.set(tidx, task)

	return projects.set(
		pidx,
		project.set(
			"tasks",
			tasks,
		),
	)
}

function updateTaskSortOrder(tasks: List<Task>, task: Task) : List<Task> {
	const taskID = task.get("id")

	const entry = tasks.findEntry(x => x.get("id") === taskID)

	// No task to update
	if(entry == null) {
		return tasks
	}

	const [ idx, orgTask ] = entry

	if(orgTask.get("sortOrder") == task.get("sortOrder")) {
		return tasks.set(idx, task)
	}

	// reorder other tasks
	const oldSort = orgTask.get("sortOrder") ?? 0
	const newSort = task.get("sortOrder") ?? 0

	const isMovingDown = oldSort < newSort
	const direction = isMovingDown ? -1 : 1

	const minSort = Math.min(oldSort, newSort)
	const maxSort = Math.max(oldSort, newSort)

	let updatedTasks = tasks

	const size = tasks.size
	for(let i = 0; i < size; i++) {
		const t = tasks.get(i)
		if(t == null) throw new Error("Unexpectedly found nothing at index")

		if(t.get("id") === taskID) {
			updatedTasks = updatedTasks.set(i, task)
			continue
		}

		const s = t.get("sortOrder") ?? 0

		if(s < minSort || s > maxSort) {
			continue
		}

		updatedTasks = updatedTasks.set(i, t.set("sortOrder", s + direction))
	}

	return updatedTasks
}

export function reducer(state?: State = defaultState, action: Action) : State {
	function addNetworkRequest(id: string, message: string) : List<NetworkRequest> {
		return state.networkRequests.push(createNetworkRequest(id, message))
	}

	switch(action.type) {
	case "NETWORK_REQUEST_CLEAR":
		return {
			...state,
			networkRequests: state.networkRequests.filter(x => x.id !== action.requestID),
		}
	case "REQUEST_ACCESS_TOKEN_WILL_LOAD":
		return {
			...state,
			networkRequests: state.networkRequests.push(createNetworkRequest(action.requestID, "Logging in")),
		}
	case "REQUEST_ACCESS_TOKEN_DID_LOAD":
		const response = action.accessToken
		const credentials = new Credentials({
			type: response.token_type,
			accessToken: response.access_token,
			accessTokenExpiration: new Date(Date.now() + (response.expires_in ?? 3600) * 1000).toJSON(),
			refreshToken: response.refresh_token,
		})
		updateStoredCredentials(credentials)

		return {
			...state,
			credentials,
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "succeeded",
				message: "Login succeeded",
			}),
		}
	case "REQUEST_ACCESS_TOKEN_DID_FAIL":
		updateStoredCredentials(null)
		return {
			...state,
			credentials: null,
			profile: null,
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "failed",
			}),
		}
	case "SIGN_OUT":
		updateStoredCredentials(null)
		return {
			...state,
			credentials: null,
			profile: null,
			networkRequests: updateNetworkRequest(addNetworkRequest("sign-out", "Signed out"), "sign-out", {
				status: "succeeded",
			}),
		}

	case "PROFILE_WILL_LOAD":
		return {
			...state,
			networkRequests: addNetworkRequest(action.requestID, "Loading profile"),
		}
	case "PROFILE_DID_LOAD":
		return {
			...state,
			profile: action.profile,
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "succeeded",
				message: "Profile loaded",
			}),
		}
	case "PROFILE_DID_FAIL":
		return {
			...state,
			profile: null,
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "failed",
				message: "Failed to load profile",
			}),
		}

	case "PROJECTS_WILL_LOAD":
		return {
			...state,
			projects: null,
			networkRequests: state.networkRequests.push(createNetworkRequest(action.requestID, "Loading projects")),
		}
	case "PROJECTS_DID_LOAD":
		return {
			...state,
			projects: List(action.projects),
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "succeeded",
				message: "Projects loaded",
			}),
		}
	case "CURRENT_TODO_WILL_LOAD":
		return {
			...state,
			currentTodo: null,
			networkRequests: state.networkRequests.push(createNetworkRequest(
				action.requestID,
				"Loading current todo",
			)),
		}
	case "CURRENT_TODO_DID_LOAD":
		return {
			...state,
			currentTodo: action.todo,
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "succeeded",
				message: "Todo loaded",
			}),
		}
	case "CURRENT_TODO_WILL_UPDATE":
		return {
			...state,
			networkRequests: state.networkRequests.push(createNetworkRequest(
				action.requestID,
				action.todoUpdate.task?.status === "done"
					? "Completing todo"
					: "Updating current todo",
			)),
		}
	case "CURRENT_TODO_DID_UPDATE":
		return {
			...state,
			currentTodo: action.todo,
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "succeeded",
				message: "Todo updated",
			}),
		}

	case "CREATE_PROJECT_WILL_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => {
				return projects.push(action.project)
			}),
			networkRequests: addNetworkRequest(action.requestID, "Creating project"),
		}
	case "CREATE_PROJECT_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateProject(projects, action.project, action.temporaryID)),
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "succeeded",
				message: "Project created",
			}),
		}
	case "UPDATE_PROJECT_WILL_SAVE":
	case "UPDATE_PROJECT_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateProject(projects, action.project)),
			networkRequests: upsertNetworkRequest(state.networkRequests, action.requestID, {
				create: "Saving project",
				success: "Project saved",
			}),
		}
	case "DELETE_PROJECT_WILL_SAVE":
	case "DELETE_PROJECT_DID_SAVE":
		return {
			...state,
			projects: state.projects?.filter(x => x.get("id") !== action.project.get("id")),
			networkRequests: upsertNetworkRequest(state.networkRequests, action.requestID, {
				create: "Deleting project",
				success: "Project deleted",
			}),
		}

	case "CREATE_TASK_WILL_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => {
				const entry = projects.findEntry(x => x.get("id") === action.projectID)
				if(entry == null) return projects
				const [ index, project ] = entry
				const tasks = project.get("tasks") ?? new List
				return projects.set(
					index,
					project.set(
						"tasks",
						tasks.push(action.task),
					),
				)
			}),
			networkRequests: addNetworkRequest(action.requestID, "Creating task"),
		}
	case "CREATE_TASK_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateTaskInProject(projects, action.task, action.temporaryID)),
			networkRequests: updateNetworkRequest(state.networkRequests, action.requestID, {
				status: "succeeded",
				message: "Task created",
			}),
		}
	case "UPDATE_TASK_WILL_SAVE":
	case "UPDATE_TASK_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateTaskInProject(projects, action.task)),
			networkRequests: upsertNetworkRequest(state.networkRequests, action.requestID, {
				create: "Updating task",
				success: "Task updated",
			}),
		}
	case "DELETE_TASK_WILL_SAVE":
	case "DELETE_TASK_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => deleteTaskInProject(projects, action.task)),
			networkRequests: upsertNetworkRequest(state.networkRequests, action.requestID, {
				create: "Deleting task",
				success: "Task deleted",
			}),
		}
	case "INIT":
		// Don't do anything here. Redux does not always actually call it INIT
		return state
	default:
		// This cast triggers flow if a type is not handled
		(action: empty)
		return state
	}
}

export const store: Store<State, Action, DispatchAPI<DispatchAction>> = createStore(reducer, applyMiddleware(thunkMiddleware))
export function useAppDispatch() : DispatchAPI<DispatchAction> { return useDispatch() }
export function useAppSelector<T>(fn: (State) => T, eq?: (T, T) => boolean) : T { return useSelector(fn, eq) }
