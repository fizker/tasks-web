// @flow strict

import * as React from "react"

const dropTargetStyle = {
	position: "absolute",
	bottom: 0,
	right: 0,
	left: 0,
	top: 0,
}

type Props = {
	isValidTarget?: (event: DragEvent) => boolean,
	onDragOver?: (event: DragEvent) => void,
	onDrop: (event: DragEvent, target: "top"|"bottom") => void,
}

export function DropTarget({ isValidTarget, onDragOver, onDrop }: Props) : React.Node {
	return <div
		style={{
			...dropTargetStyle,
		}}
		onDragOver={e => {
			onDragOver?.(e)
			if(e.isDefaultPrevented()) {
				return
			}

			e.preventDefault()
			if(isValidTarget?.(e) ?? true) {
				if(e.dataTransfer != null) {
					e.dataTransfer.dropEffect = "move"
				}
			}
		}}
	>
		<div
			style={{
				...dropTargetStyle,
				bottom: "50%",
			}}
			onDragEnter={e => {
				e.currentTarget.style.background = "blue"
			}}
			onDragLeave={e => {
				e.currentTarget.style.background = "transparent"
			}}
			onDrop={e => onDrop(e, "top")}
		>
		</div>
		<div
			style={{
				...dropTargetStyle,
				top: "50%",
			}}
			onDragEnter={e => {
				e.currentTarget.style.background = "blue"
			}}
			onDragLeave={e => {
				e.currentTarget.style.background = "transparent"
			}}
			onDrop={e => onDrop(e, "bottom")}
		>
		</div>
	</div>
}
