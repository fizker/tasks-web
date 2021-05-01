// @flow strict

import * as React from "react"

import { MarkdownTextView } from "./MarkdownTextView.js"

import { Project } from "../data.js"

type Props = {
	project: Project,
}

export function ProjectDetailsView({ project }: Props) : React.Node {
	const p = project
	const tasks = p.get("tasks")
	return <fieldset>
		<legend>{p.get("name")}</legend>
		<MarkdownTextView>{p.get("description")}</MarkdownTextView>
		{tasks == null ? null : <>
			<hr />
			<h2>Tasks</h2>
			{tasks.map(t => <div>
				<h3>{t.get("name")}</h3>
				<MarkdownTextView>{t.get("description")}</MarkdownTextView>
			</div>)}
		</>}
	</fieldset>
}
