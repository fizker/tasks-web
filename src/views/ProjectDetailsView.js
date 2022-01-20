// @flow strict

import * as React from "react"
import { Link } from "react-router-dom"

import { MarkdownTextView } from "../views.js"

import { Project, Task, TaskStatus } from "../data.js"

type Props = {
	project: Project,
}

function sortTask(x: Task, y: Task) : number {
	const xSort = x.get("sortOrder")
	const ySort = y.get("sortOrder")

	if(xSort == null && ySort == null) {
		return x.get("name") < y.get("name")
			? -1
			: 1
	}

	if(xSort == null) {
		return -1
	}

	if(ySort == null) {
		return 1
	}

	return xSort - ySort
}

export function ProjectDetailsView({ project }: Props) : React.Node {
	const p = project
	const projectID = p.get("id")
	if(projectID == null) {
		throw new Error("Cannot show details for unsaved project")
	}
	const tasks = p.get("tasks")
	return <>
		<MarkdownTextView>{p.get("description")}</MarkdownTextView>
		{tasks == null ? null : <>
			<header>
				<h2>Tasks</h2>
				<Link to="create-task">Create new</Link>
			</header>
			{tasks.filter(x => x.get("status") !== TaskStatus.done).sort(sortTask).map(t => <div key={t.get("id")}>
				<hr/>
				<header>
					<h3>{t.get("name")}</h3>
					<Link to={`edit-task/${t.get("id") ?? ""}`}>Edit</Link>
				</header>
				<MarkdownTextView>{t.get("description")}</MarkdownTextView>
			</div>)}
		</>}
	</>
}
