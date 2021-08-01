// @flow strict

import * as React from "react"
import { useParams, Route, Routes } from "react-router-dom"

import { useAppSelector as useSelector } from "../store"
import { Page } from "./Page.js"
import { LoadingDataView, ProjectDetailsView, TaskEditView } from "../views.js"
import { Task } from "../data.js"

export function ShowProject() : React.Node {
	const { projectID } = useParams()
	const projects = useSelector(x => x.projects)

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
					onSave={(task) => { console.log("saving", { task: task.toJS() }) }}
					onCancel={() => console.log("cancelling") }
				/>
			}/>
			<Route path="/" element={<ProjectDetailsView project={project} />} />
		</Routes>
	</Page>
}
