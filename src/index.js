// @flow

import React from "react"
import ReactDOM from "react-dom"

const app = <>
	<h1>Hello World</h1>
	<p>This is rendered in React!</p>
</>

const container = document.querySelector("#root")
if(container == null) {
	throw new Error("Could not load root node")
}

ReactDOM.render(app, container)
