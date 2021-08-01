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
	isMultiLine?: bool,
}
export function FormTextView<T>({ label, field, isMultiLine = false }: Props<T>) : React.Node {
	return <formContext.Consumer>{({ record, updateRecord }) =>
		<tr>
			<td style={isMultiLine ? multiLineStyle : singleLineStyle}>{label}:</td>
			<td>
				{ isMultiLine
				? <textarea
					value={record.get(field)}
					onChange={e => updateRecord(field, e.currentTarget.value)}
				/>
				: <input
					value={record.get(field)}
					onChange={e => updateRecord(field, e.currentTarget.value)}
				/>
				}
			</td>
		</tr>
	}</formContext.Consumer>
}
