// @flow strict

import * as React from "react"
import { Link } from "react-router-dom"

import { Project } from "../data.js"
import { SectionView } from "./SectionView.js"

type Props = {
	project: Project,
}

export function ProjectSummaryView({ project }: Props) : React.Node {
	return <SectionView
		name={
			<Link to={project.get("id")}>
				{project.get("name")}
			</Link>
		}
	>
		<p>{project.get("description")}</p>
	</SectionView>
}
