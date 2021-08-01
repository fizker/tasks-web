// @flow strict

import * as React from "react"
import { useParams, Route, Routes } from "react-router-dom"

import { useAppSelector as useSelector } from "../store"
import { Page } from "./Page.js"
import { ProjectDetailsView } from "../views/ProjectDetailsView.js"
import { LoadingDataView } from "../views.js"

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
			<Route path="/create-task" element={<div>create task</div>} />
			<Route path="/" element={<ProjectDetailsView project={project} />} />
		</Routes>
	</Page>
}
