// @flow strict

import { useSelector } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import type { Store, DispatchAPI } from "redux"
import type { ThunkAction } from "redux-thunk"
import type { ProjectDTO } from "./dtos.js"

type State = {
	projects: ?$ReadOnlyArray<ProjectDTO>,
}
type Action =
	| {
		type: "PROJECTS_LOADED",
		projects: $ReadOnlyArray<ProjectDTO>,
	}

type DispatchAction =
	| ThunkAction<State, Action, Promise<void>>
	| Action

export const fetchProjects: ThunkAction<State, Action, Promise<void>> = async(dispatch) => {
	const response = await fetch(`${SERVER_URL}/projects`)
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

export const store: Store<State, Action, DispatchAPI<DispatchAction>> = createStore(reducer, applyMiddleware(thunkMiddleware))
export function useAppSelector<T>(fn: (State) => T, eq?: (T, T) => boolean) : T { return useSelector(fn, eq) }
