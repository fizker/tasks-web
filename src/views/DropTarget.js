// @flow strict

import * as React from "react"

const dropTargetStyle = {
	position: "absolute",
	bottom: 0,
	right: 0,
	left: 0,
	top: 0,
}

export enum DropTargetVerticalDir {
	Top, Bottom
}

type Props = {
	isValidTarget?: (event: DragEvent) => boolean,
	onDragOver?: (event: DragEvent) => void,
	onDrop: (event: DragEvent, target: DropTargetVerticalDir) => void,
}

export function DropTarget({ isValidTarget, onDragOver, onDrop }: Props) : React.Node {
	const [ isHoveringTop, setIsHoveringTop ] = React.useState(false)
	const [ isHoveringBottom, setIsHoveringBottom ] = React.useState(false)

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
				background: isHoveringTop ? createGradient(DropTargetVerticalDir.Top) : "transparent",
				bottom: "50%",
			}}
			onDragEnter={e => {
				setIsHoveringTop(true)
			}}
			onDragLeave={e => {
				setIsHoveringTop(false)
			}}
			onDrop={e => onDrop(e, DropTargetVerticalDir.Top)}
		>
		</div>
		<div
			style={{
				...dropTargetStyle,
				background: isHoveringBottom ? createGradient(DropTargetVerticalDir.Bottom) : "transparent",
				top: "50%",
			}}
			onDragEnter={e => {
				setIsHoveringBottom(true)
			}}
			onDragLeave={e => {
				setIsHoveringBottom(false)
			}}
			onDrop={e => onDrop(e, DropTargetVerticalDir.Bottom)}
		>
		</div>
	</div>
}

function createGradient(dir: DropTargetVerticalDir) : string {
	return `linear-gradient(${dir === DropTargetVerticalDir.Top ? "180" : "0"}deg, #94e6ff, transparent)`
}
