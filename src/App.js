// @flow strict

import * as React from "react"
import {
	BrowserRouter as Router,
	Link,
	Navigate,
	Route,
	Routes,
	useLocation,
} from "react-router-dom"

import {
	CurrentTodoRoute,
	EditProject, EditProjectType,
	Projects,
	ShowProject,
	setTitle,
} from "./routes.js"

function ResetTitle() {
	const location = useLocation()
	setTitle(null)
	return null
}

export function App() : React.Node {
	return <Router>
		<ResetTitle />
		<div>
			<nav id="main-menu">
				<Link to="projects">Projects</Link>
				<Link to="todo">Current Todo</Link>
			</nav>

			<Routes>
				<Route path="/" element={<Navigate to="/projects" />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/projects/new" element={<EditProject type={EditProjectType.New} />} />
				<Route path="/projects/:projectID/edit" element={<EditProject type={EditProjectType.Edit} />} />
				<Route path="/projects/:projectID/*" element={<ShowProject />} />
				<Route path="/todo" element={<CurrentTodoRoute />} />
			</Routes>
		</div>
	</Router>
}
