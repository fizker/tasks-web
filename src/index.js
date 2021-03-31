// @flow

import * as React from "react"
import ReactDOM from "react-dom"

import { Projects } from "./routes/Projects.js"

const app = <>
	<Projects />
</>

const container = document.querySelector("#root")
if(container == null) {
	throw new Error("Could not load root node")
}

ReactDOM.render(app, container)
