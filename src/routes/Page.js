// @flow strict

import * as React from "react"

type Props = {
	name: string,
	children: React.Node,
}

export function Page({ name, children }: Props) : React.Node {
	return <fieldset>
		<legend><h1>{name}</h1></legend>
		{children}
	</fieldset>
}
