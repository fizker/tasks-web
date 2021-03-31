// @flow strict

import * as React from "react"

export function MarkdownTextView({ children }: { children: string }) : React.Node {
	return <p style={{ whiteSpace: "pre-line" }}>{children}</p>
}
