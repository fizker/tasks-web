// @flow strict

import { List } from "immutable"
import { Project, Task, Todo } from "../data.js"

import type { TaskDTO, TodoDTO, ProjectDTO } from "../dtos.js"

export function parseTask(dto: TaskDTO) : Task {
	return new Task(dto)
}

export function parseProject(dto: ProjectDTO): Project {
	const tasks = dto.tasks?.map(parseTask)
	return new Project({
		...dto,
		tasks: tasks ? List(tasks) : tasks,
	})
}

export function parseTodo(dto: TodoDTO) : Todo {
	return new Todo({
		...dto,
		project: parseProject(dto.project),
		task: dto.task ? parseTask(dto.task) : null,
	})
}
