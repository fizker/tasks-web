// @flow strict

import * as React from "react"

import { useAppSelector as useSelector } from "../store.js"
import { Page } from "./Page.js"
import { LoadingDataView, ProjectSummaryView } from "../views.js"

export function Projects() : React.Node {
	const projects = useSelector(x => x.projects)

	if(projects == null) {
		return <LoadingDataView />
	}

	return <Page name="All projects">
		{projects.map(project =>
			<ProjectSummaryView project={project} />
		)}
	</Page>
}
