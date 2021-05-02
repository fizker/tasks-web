// @flow strict

import * as React from "react"

export type ActionButton = $ReadOnly<{ text: string, type?: "primary"|"secondary", onClick: () => void }>

export function ActionButtonListView({ buttons } : { buttons: $ReadOnlyArray<ActionButton> }) : React.Node {
	return <>
		<hr/>
		<div class="action-button-list">
			{buttons.map(button => <button
				type={button.type === "primary" ? "submit" : "button"}
				onClick={button.onClick}
			>
				{button.text}
			</button>)}
		</div>
	</>
}
