// @flow strict

import * as React from "react"

type Button = {
	text: string,
	onClick: () => void,
}

type Props = {
	submitButton: { text: string },
	otherButton: Button,
}
export function FormButtonRow({ submitButton, otherButton }: Props) : React.Node {
	return <tr>
		<td colSpan={2} style={{ textAlign: "right" }}>
			{ otherButton && <button
				type="button"
				onClick={otherButton.onClick}
			>
				{otherButton.text}
			</button>}
			<button>{submitButton.text}</button>
		</td>
	</tr>
}
