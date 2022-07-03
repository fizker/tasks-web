// @flow strict

import * as React from "react"

import { clearNetworkRequest } from "../actions"
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../store.js"

function relativeDate(date: Date) : string {
	let unit = "seconds"
	let diff = (Date.now() - date) / 1000

	if(diff > 120) {
		diff /= 60
		unit = "minutes"

		if(diff > 120) {
			diff /= 60
			unit = "hours"

			if(diff > 48) {
				diff /= 24
				unit = "days"
			}
		}
	}

	return new Intl.RelativeTimeFormat().format(-Math.floor(diff), unit)
}

export function NetworkRequestView() : React.Node {
	const networkRequests = useSelector(x => x.networkRequests)
	const [ _, setCounter ] = React.useState(Date.now())
	const dispatch = useDispatch()

	if(networkRequests.size === 0) {
		return null
	}

	setTimeout(() => setCounter(Date.now()), 500)

	for(const req of networkRequests) {
		if(req.status === "succeeded" && (Date.now() - req.updatedAt) > 10_000) {
			dispatch(clearNetworkRequest(req.id))
		}
	}

	return <div>
		{networkRequests.map(x => <div key={x.id}>
			{x.message} - {x.status}
			({relativeDate(x.updatedAt)})
			{x.status === "succeeded" && <button type="button" onClick={() => { dispatch(clearNetworkRequest(x.id)) }}>X</button>}
		</div>)}
	</div>
}
