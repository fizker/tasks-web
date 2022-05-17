// @flow strict

import * as React from "react"
import {
	BrowserRouter as Router,
	Link,
	Navigate,
	Outlet,
	Redirect,
	Route,
	Routes,
	useLocation,
} from "react-router-dom"

import {
	CurrentTodoRoute,
	EditProject, EditProjectType,
	Login,
	Projects,
	ShowProject,
} from "./routes.js"
import {
	useAppSelector as useSelector,
} from "./store.js"
import {
	ResetTitle,
	TitleFromProject,
} from "./titles.js"

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
				<Route path="login" element={<Login />} />
				<Route element={<Protected />}>
					<Route path="projects">
						<Route index element={<Projects />} />
						<Route path="new" element={<EditProject type={EditProjectType.New} />} />
						<Route path=":projectID" element={<TitleFromProject />}>
							<Route path="edit" element={<EditProject type={EditProjectType.Edit} />} />
							<Route index path="*" element={<ShowProject />} />
						</Route>
					</Route>
					<Route path="/todo" element={<CurrentTodoRoute />} />
				</Route>
			</Routes>
		</div>
	</Router>
}

function Protected() {
	const credentials = useSelector(x => x.credentials)
	const location = useLocation()

	if(credentials == null) {
		return <Navigate to={`/login?returnURL=${location.pathname}`} />
	}

	return <Outlet />
}
