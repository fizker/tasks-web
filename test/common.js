// @flow strict

class SessionStorage {
	#items: {[string]: ?string}

	constructor() {
		this.#items = {}
	}

	setItem(key: string, value: string) {
		this.#items[key] = value
	}
	removeItem(key: string) {
		delete this.#items[key]
	}
	getItem(key: string) : ?string {
		debugger
		return this.#items[key]
	}
}

global.sessionStorage = new SessionStorage
