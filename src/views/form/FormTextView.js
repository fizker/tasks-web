// @flow strict

import * as React from "react"

import { formContext } from "./FormContext.js"

const singleLineStyle = {
	textAlign: "right",
}
const multiLineStyle = {
	...singleLineStyle,
	verticalAlign: "top",
}

type Props<T> = {
	label: string,
	field: string,
	type?: string,
	isMultiLine?: bool,
}
export function FormTextView<T>({ label, field, type = "text", isMultiLine = false }: Props<T>) : React.Node {
	return <formContext.Consumer>{({ record, updateRecord }) =>
		<tr>
			<td style={isMultiLine ? multiLineStyle : singleLineStyle}>{label}:</td>
			<td style={{ minWidth: "400px" }}>
				{ isMultiLine
				? <textarea
					value={record.get(field)}
					onChange={e => updateRecord(field, e.currentTarget.value)}
					style={{
						width: "100%",
						minWidth: "400px",
						minHeight: "200px",
					}}
				/>
				: <input
					value={record.get(field)}
					onChange={e => updateRecord(field, e.currentTarget.value)}
					type={type}
					style={{
						width: "100%",
					}}
				/>
				}
			</td>
		</tr>
	}</formContext.Consumer>
}
