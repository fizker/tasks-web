// @flow

import * as React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import { App } from "./App.js"
import { store, fetchProjects } from "./store.js"

store.dispatch(fetchProjects)

const app = <Provider store={store}>
	<App />
</Provider>

const container = document.querySelector("#root")
if(container == null) {
	throw new Error("Could not load root node")
}

ReactDOM.render(app, container)
