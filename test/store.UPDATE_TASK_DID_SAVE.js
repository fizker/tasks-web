// @flow

import { expect } from "chai"
import { describe, it, beforeEach } from "mocha"
import { List } from "immutable"

import { reducer } from "../src/store.js"
import { Project, Task } from "../src/data.js"

describe("store.UPDATE_TASK_DID_SAVE.js", () => {
	const requestID = "abc"

	let state = reducer(undefined, { type: "INIT" })
	beforeEach(() => {
		state = reducer(undefined, { type: "INIT" })
	})
	describe("5 tasks exist", () => {
		function getTasks() : List<Task> {
			return state.projects
				?.find(x => x.get("id") === "proj")
				.get("tasks")
				?? List()
		}
		beforeEach(() => {
			function createTask(idx) /*: Task*/ {
				return new Task({
					id: "task" + (idx + 1),
					description: "",
					sortOrder: idx,
					status: "notStarted",
					project: "proj",
				})
			}
			state = {
				projects: List([
					new Project({
						id: "proj",
						tasks: List([
							createTask(0),
							createTask(1),
							createTask(2),
							createTask(3),
							createTask(4),
						]),
					}),
				]),
				networkRequests: new List,
			}
		})
		describe("moving task 4 to spot 2", () => {
			beforeEach(() => {
				const task: ?Task = getTasks()
					.find(x => x.get("id") === "task4")
					.set("sortOrder", 1)

				if(task == null) throw new Error("could not find test task")

				state = reducer(state, {
					type: "UPDATE_TASK_DID_SAVE",
					requestID,
					task,
				})
			})
			it("should order tasks correctly", () => {
				const ordered = getTasks()
					.map(x => [ x.get("id") ?? "a", x.get("sortOrder") ?? -1 ])
					.sort((a, b) => a[0] < b[0] ? -1 : 1)
					.toJS()

				expect(ordered).to.deep.equal([
					[ "task1", 0 ],
					[ "task2", 2 ],
					[ "task3", 3 ],
					[ "task4", 1 ],
					[ "task5", 4 ],
				])
			})
		})
		describe("moving task 2 to spot 4", () => {
			beforeEach(() => {
				const task: ?Task = getTasks()
					.find(x => x.get("id") === "task2")
					.set("sortOrder", 3)

				if(task == null) throw new Error("could not find test task")

				state = reducer(state, {
					type: "UPDATE_TASK_DID_SAVE",
					requestID,
					task,
				})
			})
			it("should order tasks correctly", () => {
				const ordered = getTasks()
					.map(x => [ x.get("id") ?? "a", x.get("sortOrder") ?? -1 ])
					.sort((a, b) => a[0] < b[0] ? -1 : 1)
					.toJS()

				expect(ordered).to.deep.equal([
					[ "task1", 0 ],
					[ "task2", 3 ],
					[ "task3", 1 ],
					[ "task4", 2 ],
					[ "task5", 4 ],
				])
			})
		})
	})
})
