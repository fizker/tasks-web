// @flow strict

import * as React from "react"

type Button = {
	text: string,
	onClick: () => void,
}

type Props = {
	submitButton: { text: string },
	otherButtons: $ReadOnlyArray<Button>,
}
export function FormButtonRow({ submitButton, otherButtons }: Props) : React.Node {
	return <tr>
		<td colSpan={2} style={{ textAlign: "right" }}>
			{ otherButtons.map((otherButton, idx) => <button
				key={idx}
				type="button"
				onClick={otherButton.onClick}
			>
				{otherButton.text}
			</button>)}
			<button>{submitButton.text}</button>
		</td>
	</tr>
}
