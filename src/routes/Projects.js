// @flow strict

import * as React from "react"
import { useSelector } from "react-redux"

import { ProjectList } from "../views/ProjectList.js"
import type { ProjectDTO } from "../dtos.js"

export function Projects() : React.Node {
	const projects = useSelector(x => x.projects)

	if(projects == null) {
		return <div>Loading...</div>
	}

	return <ProjectList projects={projects} />
}
