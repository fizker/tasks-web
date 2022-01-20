// @flow strict

import * as React from "react"

import { SectionView } from "./SectionView.js"
import { Form, FormTextView, FormButtonRow } from "./form.js"
import { Project, Task, TaskStatus } from "../data.js"

type Props = {
	task: Task,
	onSave: (Task) => void,
	onDelete?: (Task) => void,
	onCancel: () => void,
}
export function TaskEditView({ task, onSave, onCancel, onDelete } : Props) : React.Node {
	return <SectionView name="Create task">
		<Form
			record={task}
			onSubmit={onSave}
		>
			<FormTextView label="Name" field="name" />
			<FormTextView label="Description" field="description" isMultiLine />
			<FormButtonRow
				submitButton={{ text: "Save" }}
				otherButtons={[
					{ text: "Cancel", onClick: onCancel },
					onDelete && { text: "Delete", onClick: () => onDelete(task) },
				].filter(Boolean)}
			/>
		</Form>
	</SectionView>
}
