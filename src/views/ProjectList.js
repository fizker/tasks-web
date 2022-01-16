// @flow strict

import * as React from "react"
import { Link } from "react-router-dom"

import { Project } from "../data.js"

import type { List } from "immutable"

type Props = {
	projects: List<Project>,
}

export function ProjectList({ projects }: Props) : React.Node {
	return <ul>
		{projects.map(p => {
			const id = p.get("id")
			if(id == null) return null
			return <li key={id}>
				<Link to={`${id}`}>
					{p.get("name")}
				</Link>
			</li>
		})}
	</ul>
}
