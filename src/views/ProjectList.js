// @flow strict

import * as React from "react"
import { Link, useRouteMatch } from "react-router-dom"

import { Project } from "../data.js"

type Props = {
	projects: $ReadOnlyArray<Project>,
}

export function ProjectList({ projects }: Props) : React.Node {
	const match = useRouteMatch()

	return <div>
		<h1>All projects</h1>
		<ul>
			{projects.map(p => {
				const id = p.get("id")
				if(id == null) return null
				return <li>
					<Link to={`${match.url}/${id}`}>
						{p.get("name")}
					</Link>
				</li>
			})}
		</ul>
	</div>
}
