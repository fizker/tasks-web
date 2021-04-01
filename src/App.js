// @flow strict

import * as React from "react"
import {
	BrowserRouter as Router,
	Link,
	Redirect,
	Route,
	Switch,
} from "react-router-dom"

import { Projects } from "./routes/Projects.js"

export function App() : React.Node {
	return <Router>
		<div>
			<Switch>
				<Route exact path="/">
					<Redirect to="/projects" />
				</Route>
				<Route path="/projects">
					<Projects />
				</Route>
			</Switch>
		</div>
	</Router>
}
