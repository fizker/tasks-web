// @flow strict

import type { ThunkAction } from "redux-thunk"
import type { State } from "../store.js"

import type { AuthAction } from "./auth"
import type { ProjectAction } from "./projects.js"
import type { TaskAction } from "./tasks.js"
import type { TodoAction } from "./todos.js"

export type AppThunkAction = ThunkAction<State, DispatchAction>

type ReduxInitAction = { type: "INIT" }

export type Action =
	| ReduxInitAction
	| AuthAction
	| ProjectAction
	| TodoAction
	| TaskAction

export type DispatchAction =
	| AppThunkAction
	| Action
