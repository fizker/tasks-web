// @flow strict

import * as React from "react"
import { Link } from "react-router-dom"

import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../store.js"
import { fetchCurrentTodo, changeCurrentTodo } from "../actions.js"

import { Page } from "./Page.js"
import { ActionButtonListView, LoadingDataView, MarkdownTextView, SectionView } from "../views.js"

export function CurrentTodoRoute() : React.Node {
	const dispatch = useDispatch()
	const currentTodo = useSelector(x => x.currentTodo)

	React.useEffect(() => {
		dispatch(fetchCurrentTodo)
	}, [true])

	if(currentTodo == null) {
		return <LoadingDataView />
	}

	const project = currentTodo.get("project")
	const task = currentTodo.get("task")

	return <Page name="Current todo">
		<SectionView
			name={<>Project: <Link to={`/projects/${project.get("id") ?? ""}`}>
				{project.get("name")}
			</Link></>}
		>
			<MarkdownTextView>{project.get("description")}</MarkdownTextView>
			<ActionButtonListView buttons={[
				{ text: "Skip project", onClick: () => { dispatch(changeCurrentTodo(null)) } },
			]}/>
		</SectionView>
		{ task
			? <SectionView name={"Task: " + task.get("name")}>
				<MarkdownTextView>{task.get("description")}</MarkdownTextView>
				<ActionButtonListView buttons={[
					{ text: "Mark as done", onClick: () => { dispatch(changeCurrentTodo("done")) } },
				]}/>
			</SectionView>
			: "No task"
		}
	</Page>
}
