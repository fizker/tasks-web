// @flow strict

import { ReorderPosition, Task } from "../data.js"

export function reorderTask(taskToReorder: Task, targetTask: Task, reorderPosition: ReorderPosition) : Task {
	const currentSortOrder = taskToReorder.get("sortOrder") ?? 0

	const targetSortOrder = targetTask.get("sortOrder") ?? 0

	let order = targetSortOrder
	switch(reorderPosition) {
	case ReorderPosition.Before:
		if(currentSortOrder < targetSortOrder) {
			order--
		}
		break
	case ReorderPosition.After:
		if(targetSortOrder < currentSortOrder) {
			order++
		}
		break
	}

	return taskToReorder.set("sortOrder", order)
}
