// @flow strict

import { useDispatch, useSelector } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import { Project, Todo } from "./data.js"

import type { Store, DispatchAPI } from "redux"
import type { Action, DispatchAction } from "./actions.js"

export type State = $ReadOnly<{
	projects: ?$ReadOnlyArray<Project>,
	currentTodo?: ?Todo,
}>

const defaultState: State = {
	projects: null,
}

function reducer(state?: State = defaultState, action: Action) : State {
	switch(action.type) {
	case "PROJECTS_LOADED":
		return {
			...state,
			projects: action.projects,
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
	case "INIT":
		// Don't do anything here. Redux does not always actually call it INIT
		return state
	default:
		(action: empty)
		return state
	}
}

export const store: Store<State, Action, DispatchAPI<DispatchAction>> = createStore(reducer, applyMiddleware(thunkMiddleware))
export function useAppDispatch() : DispatchAPI<DispatchAction> { return useDispatch() }
export function useAppSelector<T>(fn: (State) => T, eq?: (T, T) => boolean) : T { return useSelector(fn, eq) }
