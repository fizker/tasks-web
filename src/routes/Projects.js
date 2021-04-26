// @flow strict

import * as React from "react"

import { useAppSelector as useSelector } from "../store"
import { ProjectList } from "../views/ProjectList.js"

export function Projects() : React.Node {
	const projects = useSelector(x => x.projects)

	if(projects == null) {
		return <div>Loading...</div>
	}

	return <ProjectList projects={projects} />
}
