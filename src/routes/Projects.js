// @flow strict

import * as React from "react"

import { useAppSelector as useSelector } from "../store"
import { Page } from "./Page.js"
import { ProjectList } from "../views/ProjectList.js"
import { LoadingDataView } from "../views/LoadingDataView.js"

export function Projects() : React.Node {
	const projects = useSelector(x => x.projects)

	if(projects == null) {
		return <LoadingDataView />
	}

	return <Page name="All projects">
		<ProjectList projects={projects} />
	</Page>
}
