// @flow strict

import * as React from "react"

import { MarkdownTextView } from "./MarkdownTextView.js"

import type { ProjectDTO } from "../dtos.js"

type Props = {
	projects: $ReadOnlyArray<ProjectDTO>,
}

export function ProjectList({ projects }: Props) : React.Node {
	return <div>
		{projects.map(p => <fieldset>
			<legend>{p.name}</legend>
			<MarkdownTextView>{p.description}</MarkdownTextView>
			{p.tasks == null ? null : <>
				<hr />
				<h2>Tasks</h2>
				{p.tasks.map(t => <div>
					<h3>{t.name}</h3>
					<MarkdownTextView>{t.description}</MarkdownTextView>
				</div>)}
			</>}
		</fieldset>)}
	</div>
}
