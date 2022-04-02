// @flow strict

import { useNavigate, resolvePath } from "react-router-dom"

export { CurrentTodoRoute } from "./routes/CurrentTodoRoute.js"
export { EditProject, EditProjectType } from "./routes/EditProject.js"
export { Projects } from "./routes/Projects.js"
export { ShowProject } from "./routes/ShowProject.js"

export function useRelativeNavigate() : (string) => void {
	const nav = useNavigate()
	return (path: string) => {
		if(path.startsWith(".")) {
			nav(resolvePath(path, window.location.pathname))
		} else {
			nav(path)
		}
	}
}

export function setTitle(title: ?string) {
	if(title != null) {
		document.title = `${title} - ${document.title}`
	} else {
		document.title = "Tasks"
	}
}
