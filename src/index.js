// @flow

import * as React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

import { App } from "./App.js"
import { fetchProjects } from "./actions.js"
import { store } from "./store.js"

store.dispatch(fetchProjects)

const app = <Provider store={store}>
	<App />
</Provider>

const container = document.querySelector("#root")
if(container == null) {
	throw new Error("Could not load root node")
}

const root = createRoot(container)
root.render(app)
