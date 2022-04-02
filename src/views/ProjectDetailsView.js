// @flow strict

import * as React from "react"
import { Link } from "react-router-dom"

import { Project, ReorderPosition, Task, TaskStatus } from "../data.js"
import { reorderTask } from "../transforms.js"
import { DropTarget, DropTargetVerticalDir, MarkdownTextView } from "../views.js"

type Props = {
	project: Project,
	onReorderTask: (Task) => void,
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

export function ProjectDetailsView({ project, onReorderTask }: Props) : React.Node {
	const [ isDragging, setIsDragging ] = React.useState(null)

	const p = project
	const projectID = p.get("id")
	if(projectID == null) {
		throw new Error("Cannot show details for unsaved project")
	}
	const tasks = p.get("tasks")
	return <>
		<div style={{ position: "relative" }}>
			<Link
				style={{
					position: "absolute",
					top: 0,
					right: 0,
				}}
				to="edit"
			>
				Edit
			</Link>
			<MarkdownTextView>{p.get("description")}</MarkdownTextView>
		</div>
		{tasks == null ? null : <>
			<header>
				<h2>Tasks</h2>
				<Link to="create-task">Create new</Link>
			</header>
			{tasks
			.filter(x => x.get("status") !== TaskStatus.done)
			.sort(sortTask)
			.map(t => <div
				key={t.get("id") ?? "unsaved"}
				className="project-list__item--wrapper"
			>
				<article
					className="project-list__item"
					style={{ position: "relative" }}
				>
					{ isDragging != null && isDragging !== t.get("id") && <DropTarget
						onDrop={(event, target) => {
							event.preventDefault()

							let dir: ReorderPosition
							switch(target) {
							case DropTargetVerticalDir.Top:
								dir = ReorderPosition.Before
								break
							case DropTargetVerticalDir.Bottom:
								dir = ReorderPosition.After
								break
							}
							if(dir == null) throw new Error

							const taskID = event.dataTransfer?.getData("text/plain")
							const taskToChange = tasks.find(x => x.get("id") === taskID)

							onReorderTask(reorderTask(taskToChange, t, dir))
						}}
					/> }

					<header>
						<h3
							draggable
							onDragStart={e => {
								setIsDragging(t.get("id"))
								onDragStart(e, t)
							}}
							onDragEnd={e => {
								setIsDragging(null)
							}}
						>
							{t.get("name")}
						</h3>
						<Link to={`edit-task/${t.get("id") ?? ""}`}>Edit</Link>
					</header>
					{ t.get("description") &&
					<MarkdownTextView>{t.get("description")}</MarkdownTextView>
					}
				</article>
			</div>)}
		</>}
	</>
}
