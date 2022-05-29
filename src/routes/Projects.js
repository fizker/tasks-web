// @flow strict

import * as React from "react"
import {
	Link,
} from "react-router-dom"

import { fetchProjects } from "../actions.js"
import { useAppSelector as useSelector, useAppDispatch as useDispatch } from "../store.js"
import { Page } from "./Page.js"
import { LoadingDataView, ProjectSummaryView } from "../views.js"

export function Projects() : React.Node {
	const dispatch = useDispatch()
	const projects = useSelector(x => x.projects)

	if(projects == null) {
		dispatch(fetchProjects())
		return <LoadingDataView />
	}

	return <Page name="All projects">
		<Link to="new">New</Link>
		{projects.map(project =>
			<ProjectSummaryView key={project.get("id")} project={project} />
		)}
	</Page>
}
