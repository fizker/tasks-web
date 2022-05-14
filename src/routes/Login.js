// @flow strict

import * as React from "react"
import { Record } from "immutable"

import { Credentials } from "../data.js"
import { Page } from "./Page.js"
import { Form, FormTextView, FormButtonRow } from "../views/form.js"

type Props = {
	returnPath?: string,
}
export function Login({ returnPath }: Props) : React.Node {
	const storedCredentials = new Credentials()
	return <Page name="Login">
		<Form record={storedCredentials} onSubmit={(creds) => {}}>
			<FormTextView label="Username" field="username" />
			<FormTextView label="Password" field="password" type="password" />
			<FormButtonRow submitButton={{ text: "Login" }} otherButtons={[]} />
		</Form>
	</Page>
}
