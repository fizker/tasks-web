// @flow strict

import * as React from "react"
import { useParams } from "react-router-dom"

import { useAppSelector as useSelector } from "../store"
import { Page } from "./Page.js"
import { ProjectDetailsView } from "../views/ProjectDetailsView.js"

export function ShowProject() : React.Node {
	const { projectID } = useParams()
	const projects = useSelector(x => x.projects)

	if(projects == null) {
		return <div>Loading...</div>
	}
	const project = projects.find(x => x.get("id") == projectID)

	if(project == null) {
		return <div>Project not found</div>
	}

	return <Page name={project.get("name")}>
		<ProjectDetailsView project={project} />
	</Page>
}
