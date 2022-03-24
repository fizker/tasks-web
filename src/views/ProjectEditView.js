// @flow strict

import * as React from "react"

import { Project } from "../data.js"
import { Form, FormTextView, FormButtonRow } from "./form.js"
import { SectionView } from "./SectionView.js"

type Props = {
	project: Project,
	onSave: (Project) => void,
	onDelete?: (Project) => void,
	onCancel: () => void,
}

export function ProjectEditView({ project, onSave, onCancel, onDelete }: Props) : React.Node {
	return <Form
		record={project}
		onSubmit={onSave}
	>
		<FormTextView label="Name" field="name" />
		<FormTextView label="Description" field="description" isMultiLine />
		<FormButtonRow
			submitButton={{ text: "Save" }}
			otherButtons={[
				{ text: "Cancel", onClick: onCancel },
				onDelete && { text: "Delete", onClick: () => onDelete(project) },
			].filter(Boolean)}
		/>
	</Form>
}
