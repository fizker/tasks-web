// @flow strict

import * as React from "react"

import { ProjectList } from "../views/ProjectList.js"
import type { ProjectDTO } from "../dtos.js"

type Props = {
}
type State = {
	projects: ?$ReadOnlyArray<ProjectDTO>,
}

export class Projects extends React.Component<Props, State> {
	#projects: ?Promise<$ReadOnlyArray<ProjectDTO>>

	state: State = {
		projects: null,
	}

	componentDidMount() {
		this.#projects = fetch("http://localhost:8080/projects")
			.then(x => x.json())
		this.#projects
			.then(x => this.setState({ projects: x }))
	}

	render() : React.Node {
		const { projects } = this.state

		if(projects == null) {
			return <div>Loading...</div>
		}

		return <ProjectList projects={projects} />
	}
}
