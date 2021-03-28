import React from "react"
import ReactDOM from "react-dom"

const app = <>
	<h1>Hello World</h1>
	<p>This is rendered in React!</p>
</>

const container = document.querySelector("#root")

ReactDOM.render(app, container)
