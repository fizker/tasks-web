// @flow strict

import * as React from "react"

type Props = {
	error: ?string
}
export function FormValidationError({ error } : Props) : React.Node {
	if(error == null) {
		return null
	}

	return <tr>
		<td className="validation-error" colSpan="2">
			{error}
		</td>
	</tr>
}
