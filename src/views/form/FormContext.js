// @flow strict

import * as React from "react"

import type { RecordInstance } from "immutable"

type Context<T> = $ReadOnly<{
	record: RecordInstance<T>,
	updateRecord: (key: string, value: string) => void,
}>

// $FlowFixMe[missing-type-arg]
const defaultValues: Context = {
	record: null,
	updateRecord: () => {},
}

// $FlowFixMe[missing-type-arg]
export const formContext: React$Context<Context> = React.createContext(defaultValues)
