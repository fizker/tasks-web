// @flow strict

import { List } from "immutable"
import { useDispatch, useSelector } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import { Project, Task, Todo } from "./data.js"

import type { Store, DispatchAPI } from "redux"
import type { Action, DispatchAction } from "./actions.js"

export type State = $ReadOnly<{
	projects: ?List<Project>,
	currentTodo?: ?Todo,
}>

const defaultState: State = {
	projects: null,
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
	switch(action.type) {
	case "PROJECTS_WILL_LOAD":
		return {
			...state,
			projects: null,
		}
	case "PROJECTS_DID_LOAD":
		return {
			...state,
			projects: List(action.projects),
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
	case "CREATE_PROJECT_WILL_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => {
				return projects.push(action.project)
			}),
		}
	case "CREATE_PROJECT_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateProject(projects, action.project, action.temporaryID)),
		}
	case "UPDATE_PROJECT_WILL_SAVE":
	case "UPDATE_PROJECT_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateProject(projects, action.project)),
		}
	case "DELETE_PROJECT_WILL_SAVE":
	case "DELETE_PROJECT_DID_SAVE":
		return {
			...state,
			projects: state.projects?.filter(x => x.get("id") === action.project.get("id")),
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
		}
	case "CREATE_TASK_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateTaskInProject(projects, action.task, action.temporaryID)),
		}
	case "UPDATE_TASK_WILL_SAVE":
	case "UPDATE_TASK_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => updateTaskInProject(projects, action.task)),
		}
	case "DELETE_TASK_WILL_SAVE":
	case "DELETE_TASK_DID_SAVE":
		return {
			...state,
			projects: state.projects?.update(projects => deleteTaskInProject(projects, action.task)),
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
