// @flow strict

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Record } from "immutable"

import { requestAccessToken } from "../actions"
import { Page } from "./Page.js"
import { useAppDispatch as useDispatch } from "../store.js"
import { Form, FormTextView, FormButtonRow, FormValidationError } from "../views/form.js"

import type { RecordFactory } from "immutable"

const Credentials: RecordFactory<{ username: string, password: string }> = Record({
	username: "", password: "",
})

type Props = {
	returnPath?: string,
}
export function Login({ returnPath }: Props) : React.Node {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [ validationErrors, setValidationErrors ] = React.useState([])

	const storedCredentials = new Credentials()
	return <Page name="Login">
		<Form record={storedCredentials} onSubmit={(creds) => {
			const result = validateLogin(creds)
			if(result.errors.length == 0) {
				dispatch(requestAccessToken(result.username, result.password, () => {
					navigate(returnPath ?? getReturnURLFromQuery() ?? "/")
				}))
				setValidationErrors([])
			} else {
				setValidationErrors(result.errors)
			}
		}}>
			<FormTextView label="Username" field="username" />
			<FormTextView label="Password" field="password" type="password" />
			{validationErrors.map((x, idx) => <FormValidationError key={idx} error={x} />)}
			<FormButtonRow submitButton={{ text: "Login" }} otherButtons={[]} />
		</Form>
	</Page>
}

function validateLogin(creds: Credentials) : { username: string, password: string, errors: Array<string> } {
	const username = creds.get("username") ?? ""
	const password = creds.get("password") ?? ""

	const errors = []

	if(username.trim().length == 0) {
		errors.push("Username is required")
	}

	if(password.trim().length == 0) {
		errors.push("Password is required")
	}

	return { username, password, errors }
}

function getReturnURLFromQuery() : ?string {
	const url = new URL(location.href)
	return url.searchParams.get("returnURL")
}
