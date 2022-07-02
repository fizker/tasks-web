// @flow strict

import { Profile } from "../data.js"
import { HTTPError, post } from "./http.js"

import type {
	AccessTokenResponse,
	ErrorResponse,
} from "../dtos.js"
import type { AppThunkAction } from "./types.js"

type RequestAccessTokenWillLoadAction = {
	type: "REQUEST_ACCESS_TOKEN_WILL_LOAD",
	username: string,
	password: string,
}
type RequestAccessTokenDidLoadAction = {
	type: "REQUEST_ACCESS_TOKEN_DID_LOAD",
	accessToken: AccessTokenResponse,
}
// TODO: Throw this when getting 401
type RequestAccessTokenDidFailAction = {
	type: "REQUEST_ACCESS_TOKEN_DID_FAIL",
	error: ErrorResponse,
}
type RequestAccessTokenAction =
	| RequestAccessTokenWillLoadAction
	| RequestAccessTokenDidLoadAction
	| RequestAccessTokenDidFailAction

type ProfileWillLoadAction = {
	type: "PROFILE_WILL_LOAD",
}
type ProfileDidLoadAction = {
	type: "PROFILE_DID_LOAD",
	profile: Profile,
}
type ProfileDidFailAction = {
	type: "PROFILE_DID_FAIL",
}
type SignOutAction = {
	type: "SIGN_OUT",
}
type ProfileAction =
	| ProfileWillLoadAction
	| ProfileDidLoadAction
	| ProfileDidFailAction
	| SignOutAction

export type AuthAction =
	| ProfileAction
	| RequestAccessTokenAction

export function requestAccessToken(username: string, password: string, onSuccess: () => void) : AppThunkAction {
	return async (dispatch) => {
		dispatch({
			type: "REQUEST_ACCESS_TOKEN_WILL_LOAD",
			username,
			password,
		})

		const request = {
			grant_type: "password",
			username,
			password,
		}

		try {
			const res: AccessTokenResponse = await post("/auth/token", request, null)

			dispatch({
				type: "REQUEST_ACCESS_TOKEN_DID_LOAD",
				accessToken: res,
			})

			onSuccess()
		} catch(e) {
			let error: ErrorResponse

			if(e instanceof HTTPError && e.status === 400) {
				// This is an OAuth ErrorResponse
				error = await e.response.json()
			} else {
				error = {
					error: "server_error",
					error_description: e.message,
				}
			}

			dispatch({
				type: "REQUEST_ACCESS_TOKEN_DID_FAIL",
				error: error,
			})
		}
	}
}

export function signOut() : AppThunkAction {
	return async (dispatch) => {
		dispatch({
			type: "SIGN_OUT",
		})
	}
}
