// @flow

import { expect } from "chai"
import { describe, it, beforeEach } from "mocha"
import { List } from "immutable"

import { createTask } from "../src/actions.js"
import { reducer } from "../src/store.js"
import { Project, Task } from "../src/data.js"

describe("store.create-task-flow.js", () => {
	const projectID = "test-project"

	let state = reducer(undefined, { type: "INIT" })
	beforeEach(() => {
		state = reducer(undefined, { type: "INIT" })
		state = reducer(state, {
			type: "PROJECTS_DID_LOAD",
			projects: [
				new Project({
					id: projectID,
					tasks: List([]),
				}),
			],
		})
	})

	describe("Sending `CREATE_TASK_WILL_SAVE` event", () => {
		beforeEach(() => {
			state = reducer(state, {
				type: "CREATE_TASK_WILL_SAVE",
				projectID,
				temporaryID: "new-task",
				task: new Task({
					id: "new-task",
					project: projectID,
					description: "some describ",
				}),
			})
		})

		it("should update the state with the new task", () => {
			const project = state.projects?.find(x => x.get("id") === projectID)
			const tasks = project?.get("tasks")
			expect(tasks?.count()).to.equal(1)

			const task = tasks?.get(0)
			expect(task?.get("id")).to.equal("new-task")
			expect(task?.get("description")).to.equal("some describ")
		})

		describe("when matching `CREATE_TASK_DID_SAVE` event is sent", () => {
			beforeEach(() => {
				state = reducer(state, {
					type: "CREATE_TASK_DID_SAVE",
					temporaryID: "new-task",
					task: new Task({
						id: "saved-task",
						project: projectID,
						description: "some describ",
					}),
				})
			})

			it("should update the new task to match the updated task", () => {
				const project = state.projects?.find(x => x.get("id") === projectID)
				const tasks = project?.get("tasks")
				expect(tasks?.count()).to.equal(1)

				const task = tasks?.get(0)
				expect(task?.get("id")).to.equal("saved-task")
				expect(task?.get("description")).to.equal("some describ")
			})
		})
	})
})
