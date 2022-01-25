// @flow strict

import * as React from "react"
import { Link } from "react-router-dom"

import { DropTarget, MarkdownTextView } from "../views.js"

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

function onDragStart(event, task: Task) {
	const id = task.get("id") ?? ""
	event.dataTransfer.setData("text/plain", id)
	// This is a hack to allow the drag-over handler to access the id
	event.dataTransfer.setData("application/id-" + id, "true")
	event.dataTransfer.effectAllowed = "move"
}
function onDrop(event, task: Task, dropTarget: "top"|"bottom") {
	event.preventDefault()
	const idOfDraggedElement = event.dataTransfer?.getData("text/plain")
	console.log("onDrop", {
		targetName: task.get("name"),
		target: dropTarget === "top" ? "before" : "after",
		idOfDraggedElement,
	})
}

export function ProjectDetailsView({ project }: Props) : React.Node {
	const [ isDragging, setIsDragging ] = React.useState(null)

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
				<article
					draggable
					onDragStart={e => {
						setIsDragging(t.get("id"))
						onDragStart(e, t)
					}}
					onDragEnd={e => {
						setIsDragging(null)
					}}
					style={{ position: "relative" }}
				>
					{ isDragging != null && isDragging !== t.get("id") && <DropTarget
						onDrop={(event, target) => onDrop(event, t, target)}
					/> }

					<header>
						<h3>{t.get("name")}</h3>
						<Link to={`edit-task/${t.get("id") ?? ""}`}>Edit</Link>
					</header>
					<MarkdownTextView>{t.get("description")}</MarkdownTextView>
				</article>
			</div>)}
		</>}
	</>
}
