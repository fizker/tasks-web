// @flow strict

import * as React from "react"
import { useNavigate, useParams, Route, Routes } from "react-router-dom"

import { createTask, deleteTask, updateTask } from "../actions.js"
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../store.js"
import { Page } from "./Page.js"
import { LoadingDataView, ProjectDetailsView, TaskEditView } from "../views.js"
import { Task } from "../data.js"

function EditTask({ project, onSave, onCancel, onDelete }) {
	const { taskID } = useParams()
	const navigate = useNavigate()

	const task = taskID == null ? null : project.get("tasks")?.find(x => x.get("id") === taskID)

	if(task == null) {
		return null // TODO: return 404
	}

	return <TaskEditView
		task={task}
		onSave={onSave}
		onCancel={onCancel}
		onDelete={onDelete}
	/>
}

export function ShowProject() : React.Node {
	const dispatch = useDispatch()
	const { projectID } = useParams()
	const projects = useSelector(x => x.projects)
	const navigate = useNavigate()

	if(projectID == null) {
		throw new Error("ShowProject must be used in a route with a :projectID parameter")
	}

	if(projects == null) {
		return <LoadingDataView />
	}
	const project = projects.find(x => x.get("id") == projectID)

	if(project == null) {
		return <div>Project not found</div>
	}

	return <Page name={project.get("name")}>
		<Routes>
			<Route path="/create-task" element={
				<TaskEditView
					task={new Task({
						project: project.get("id"),
					})}
					onSave={(task) => {
						dispatch(createTask(projectID, task))
						navigate(".")
					}}
					onCancel={() => { navigate(".") }}
				/>
			}/>
			<Route path="/edit-task/:taskID" element={
				<EditTask
					project={project}
					onSave={(task) => {
						dispatch(updateTask(task))
						navigate(".")
					}}
					onDelete={(task) => {
						dispatch(deleteTask(task))
						navigate(".")
					}}
					onCancel={() => { navigate(".") }}
				/>
			} />
			<Route
				path="/"
				element={<ProjectDetailsView
					project={project}
					onReorderTask={(task) => {
						dispatch(updateTask(task))
					}}
				/>}
			/>
		</Routes>
	</Page>
}
