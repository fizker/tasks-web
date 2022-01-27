// @flow

import { expect } from "chai"
import { describe, it, beforeEach } from "mocha"
import { List } from "immutable"

import { reorderTask } from "../../src/transforms.js"
import { ReorderPosition, Task } from "../../src/data.js"

describe("transforms/reorderTask.js", () => {
	describe("Moving task with order 1 to a task with order 3", () => {
		const task1 = Task({
			id: "first",
			sortOrder: 1,
		})
		const task3 = Task({
			id: "third",
			sortOrder: 3,
		})
		let updatedTask: Task
		describe("positioned before", () => {
			beforeEach(() => {
				updatedTask = reorderTask(task1, task3, ReorderPosition.Before)
			})
			it("should return the task with order 2", () => {
				expect(updatedTask.get("sortOrder")).to.equal(2)
			})
		})

		describe("positioned after", () => {
			beforeEach(() => {
				updatedTask = reorderTask(task1, task3, ReorderPosition.After)
			})
			it("should return the task with order 3", () => {
				expect(updatedTask.get("sortOrder")).to.equal(3)
			})
		})
	})
	describe("Moving task with order 4 to a task with order 2", () => {
		const task2 = Task({
			id: "second",
			sortOrder: 2,
		})
		const task4 = Task({
			id: "fourth",
			sortOrder: 4,
		})
		let updatedTask: Task
		describe("positioned before", () => {
			beforeEach(() => {
				updatedTask = reorderTask(task4, task2, ReorderPosition.Before)
			})
			it("should return the task with order 2", () => {
				expect(updatedTask.get("sortOrder")).to.equal(2)
			})
		})

		describe("positioned after", () => {
			beforeEach(() => {
				updatedTask = reorderTask(task4, task2, ReorderPosition.After)
			})
			it("should return the task with order 3", () => {
				expect(updatedTask.get("sortOrder")).to.equal(3)
			})
		})
	})
})
