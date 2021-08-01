// @flow strict

import * as React from "react"

export function SectionView({ name, children }: { name: React.Node, children: React.Node }) : React.Node {
	return <fieldset>
		<legend><h2>{name}</h2></legend>
		{children}
	</fieldset>
}
