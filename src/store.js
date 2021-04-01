// @flow strict

import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import type { ProjectDTO } from "./dtos.js"

type State = {
	projects: ?$ReadOnlyArray<ProjectDTO>,
}
type Action =
	| {
		type: "PROJECTS_LOADED",
		projects: $ReadOnlyArray<ProjectDTO>,
	}

export async function fetchProjects(dispatch: (Action) => void) {
	const response = await fetch("http://localhost:8080/projects")
	const json = await response.json()
	dispatch({ type: "PROJECTS_LOADED", projects: json })
}

function reducer(state: ?State, action: Action) : State {
	switch(action.type) {
	case "PROJECTS_LOADED":
		return {
			...state,
			projects: action.projects,
		}
	default:
		return {
			projects: null,
		}
	}
}

export const store = createStore(reducer, applyMiddleware(thunkMiddleware))
