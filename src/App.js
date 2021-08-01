// @flow strict

import * as React from "react"
import {
	BrowserRouter as Router,
	Link,
	Redirect,
	Route,
	Switch,
} from "react-router-dom"

import { CurrentTodoRoute } from "./routes/CurrentTodoRoute.js"
import { Projects } from "./routes/Projects.js"
import { ShowProject } from "./routes/ShowProject.js"

export function App() : React.Node {
	return <Router>
		<div>
			<nav id="main-menu">
				<Link to="/projects">Projects</Link>
				<Link to="/todo">Current Todo</Link>
			</nav>

			<Switch>
				<Route exact path="/">
					<Redirect to="/projects" />
				</Route>
				<Route path="/projects/:projectID">
					<ShowProject />
				</Route>
				<Route path="/projects">
					<Projects />
				</Route>
				<Route path="/todo">
					<CurrentTodoRoute />
				</Route>
			</Switch>
		</div>
	</Router>
}
