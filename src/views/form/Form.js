// @flow strict

import * as React from "react"

import type { RecordInstance } from "immutable"

import { formContext } from "./FormContext.js"

type Props<T, Record: RecordInstance<T>> = {
	record: Record,
	onSubmit: (Record) => void,
	children: React.Node,
}
export function Form<T, Record: RecordInstance<T>>({ record: r, onSubmit, children }: Props<T, Record>) : React.Node {
	const [ record, setRecord ] = React.useState(r)

	return <form
		onSubmit={(e) => {
			e.preventDefault()
			onSubmit(record)
		}}
	>
		<table>
			<tbody>
				<formContext.Provider
					value={{
						record,
						updateRecord: (key, value) => {
							// $FlowFixMe[unclear-type]
							const r:any = record
							setRecord(r.set(key, value))
						}
					}}
				>
					{children}
				</formContext.Provider>
			</tbody>
		</table>
	</form>
}
