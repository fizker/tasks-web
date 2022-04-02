// @flow strict

import * as React from "react"

import {
	Outlet,
	useLocation,
	useParams,
} from "react-router-dom"

import { useAppSelector as useSelector } from "./store.js"

export function setTitle(title: ?string) {
	if(title != null) {
		document.title = `${title} - ${document.title}`
	} else {
		document.title = "Tasks"
	}
}

export function ResetTitle() : React.Node {
	const location = useLocation()
	setTitle(null)
	return <Outlet />
}

export function TitleFromProject() : React.Node {
	const { projectID } = useParams()
	const projects = useSelector(x => x.projects)

	const project = projects?.find(x => x.get("id") == projectID)
	const name = project?.get("name")

	if(name != null) {
		setTitle(name)
	}

	return <Outlet />
}
