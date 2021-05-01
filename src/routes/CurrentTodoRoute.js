// @flow strict

import * as React from "react"

import {
	useAppDispatch as useDispatch, useAppSelector as useSelector,
	fetchCurrentTodo,
} from "../store"
import { Page } from "./Page.js"
import { LoadingDataView } from "../views/LoadingDataView.js"

export function CurrentTodoRoute() : React.Node {
	const dispatch = useDispatch()
	const currentTodo = useSelector(x => x.currentTodo)

	React.useEffect(() => {
		dispatch(fetchCurrentTodo)
	}, [true])

	if(currentTodo == null) {
		return <LoadingDataView />
	}

	return <Page name="Current todo">
		Project: {currentTodo.get("project").get("name")}
		Task: {currentTodo.get("task")?.get("name") ?? "No task"}
	</Page>
}
