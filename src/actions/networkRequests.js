// @flow strict

import { List } from "immutable"

export type NetworkRequest = $ReadOnly<{
	id: string,
	status: "waitingForResponse" | "succeeded" | "failed",
	updatedAt: Date,
	message: string,
}>

export type NetworkRequestAction =
	| {
		type: "NETWORK_REQUEST_CLEAR",
		requestID: string,
	}

export function clearNetworkRequest(requestID: string) : NetworkRequestAction {
	return {
		type: "NETWORK_REQUEST_CLEAR",
		requestID,
	}
}

export function createNetworkRequest(id: string, message: string = "") : NetworkRequest {
	return {
		id,
		status: "waitingForResponse",
		updatedAt: new Date,
		message,
	}
}

export function updateNetworkRequest(requests: List<NetworkRequest>, requestID: string, request: $Shape<NetworkRequest>) : List<NetworkRequest> {
	const idx = requests.findIndex(x => x.id === requestID)
	if(idx < 0) return requests
	const existing = requests.get(idx)
	return requests.set(idx, {
		...existing,
		...request,
		updatedAt: new Date,
	})
}

export function upsertNetworkRequest(requests: List<NetworkRequest>, requestID: string, messages: { create: string, success: string }) : List<NetworkRequest> {
	const updatedList = updateNetworkRequest(requests, requestID, { status: "succeeded", message: messages.success })
	return updatedList === requests
		? requests.push(createNetworkRequest(requestID, messages.create))
		: updatedList
}
