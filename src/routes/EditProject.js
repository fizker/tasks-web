// @flow strict

import * as React from "react"
import { useParams } from "react-router-dom"

import {
	createProject, deleteProject, updateProject, fetchProjects,
} from "../actions.js"
import { Project } from "../data.js"
import { Page } from "./Page.js"
import { useRelativeNavigate } from "../routes.js"
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../store.js"
import { LoadingDataView, ProjectEditView } from "../views.js"

export enum EditProjectType {
	New, Edit
}

type Props = {
	type: EditProjectType,
}

export function EditProject({ type }: Props) : React.Node {
	const dispatch = useDispatch()
	const { projectID } = useParams()
	const projects = useSelector(x => x.projects)
	const navigate = useRelativeNavigate()

	let title: string
	let project: Project
	let onDelete: void | (Project) => void

	switch(type) {
	case EditProjectType.New:
		title = "Create project"
		project = new Project()
		break
	case EditProjectType.Edit:
		if(projects == null) {
			dispatch(fetchProjects())
			return <LoadingDataView />
		}

		const p = projects.find(x => x.get("id") === projectID)
		if(p == null) {
			// TODO: handle 404
			return null
		}
		project = p
		title = `Edit project: ${project.get("name")}`
		onDelete = (project) => {
			dispatch(deleteProject(project))
			navigate("../..")
		}
		break
	}
	if(title == null || project == null) throw new Error

	return <Page name={title}>
		<ProjectEditView
			project={project}
			onSave={(project) => {
				switch(type) {
				case EditProjectType.New:
					dispatch(createProject(project, p => {
						navigate(`../${p.get("id") ?? ""}`)
					}))
					break
				case EditProjectType.Edit:
					dispatch(updateProject(project))
					navigate("..")
					break
				}
			}}
			onDelete={onDelete}
			onCancel={() => { navigate("..") }}
		/>
	</Page>
}
