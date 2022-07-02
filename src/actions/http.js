// @flow strict

import { Credentials } from "../data.js"

class InvalidResponseError extends Error {
}

async function parseJSONResponse<T, U>(response: Response, onNoJSON: () => U) : Promise<T|U> {
	if(response.headers.get("content-type")?.startsWith("application/json")) {
		const json: T = await response.json()
		return json
	} else {
		return onNoJSON()
	}
}

function authHeader(credentials: ?Credentials, h: { [string]: string} | Headers = new Headers()) : Headers {
	const headers = h instanceof Headers
		? h
		: new Headers(h)

	if(credentials != null) {
		// TODO: Test the expiration date

		const accessToken = credentials.get("accessToken") ?? ""
		const type = credentials.get("type") ?? "bearer"
		headers.set("authorization", `${type} ${accessToken}`)
	}

	return headers
}

export async function get<T>(path: string, credentials: Credentials) : Promise<T> {
	const response = await fetch(`${SERVER_URL}${path}`, {
		headers: authHeader(credentials),
	})
	return parseJSONResponse(response, () => { throw new InvalidResponseError() })
}

/// Note: This is called `del` because `delete` is a keyword.
export async function del<T>(path: string, credentials: Credentials) : Promise<?T> {
	const response = await fetch(`${SERVER_URL}${path}`, {
		method: "DELETE",
		headers: authHeader(credentials),
	})
	return parseJSONResponse(response, () => null)
}

export async function post<ResponseDTO, UpdateDTO = void>(path: string, data?: UpdateDTO, credentials: Credentials|null) : Promise<ResponseDTO> {
	const body = data == null ? null : JSON.stringify(data)
	const response = await fetch(`${SERVER_URL}${path}`, {
		method: "POST",
		body,
		headers: authHeader(credentials, {
			"content-type": "application/json",
		}),
	})
	return parseJSONResponse(response, () => { throw new InvalidResponseError() })
}

export async function put<ResponseDTO, UpdateDTO>(path: string, data: UpdateDTO, credentials: Credentials) : Promise<ResponseDTO> {
	const body = JSON.stringify(data)
	const response = await fetch(`${SERVER_URL}${path}`, {
		method: "PUT",
		body,
		headers: authHeader(credentials, {
			"content-type": "application/json",
		}),
	})
	return parseJSONResponse(response, () => { throw new InvalidResponseError() })
}
