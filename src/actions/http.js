// @flow strict

import { Credentials } from "../data.js"

// TODO: All HTTP functions should use this, not just delete
async function parseJSONResponse<T>(response: Response) : Promise<?T> {
	if(response.headers.get("content-type")?.startsWith("application/json")) {
		const json: T = await response.json()
		return json
	} else {
		return null
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
	const json: T = await response.json()
	return json
}

/// Note: This is called `del` because `delete` is a keyword.
export async function del<T>(path: string, credentials: Credentials) : Promise<?T> {
	const response = await fetch(`${SERVER_URL}${path}`, {
		method: "DELETE",
		headers: authHeader(credentials),
	})
	return parseJSONResponse(response)
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
	const json: ResponseDTO = await response.json()
	return json
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
	const json: ResponseDTO = await response.json()
	return json
}
