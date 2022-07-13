// @flow strict

import * as React from "react"

import { clearNetworkRequest } from "../actions"
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from "../store.js"

import type { NetworkRequestStatus } from "../actions/networkRequests.js"

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

	return new Intl.RelativeTimeFormat().format(-Math.ceil(diff), unit)
}

export function NetworkRequestView() : React.Node {
	const networkRequests = useSelector(x => x.networkRequests)
	const [ _, setCounter ] = React.useState(Date.now())
	const dispatch = useDispatch()

	React.useEffect(() => {
		for(const req of networkRequests) {
			if(req.status === "succeeded" && (Date.now() - req.updatedAt) > 5_000) {
				dispatch(clearNetworkRequest(req.id))
			}
		}

		if(networkRequests.size === 0) {
			return
		}

		const timeout = setTimeout(() => setCounter(Date.now()), 100)
		return () => {
			clearTimeout(timeout)
		}
	})

	if(networkRequests.size === 0) {
		return null
	}

	return <div className="net-req-container">
		{networkRequests.map(x => <div key={x.id} className="net-req">
			<span className="net-req__message">{x.message}</span>
			<span className="net-req__status">{translateStatus(x.status)}</span>
			<span className="net-req__updated-at">({relativeDate(x.updatedAt)})</span>
			<span className="net-req__button">
				{x.status !== "waitingForResponse" && <button type="button" onClick={() => { dispatch(clearNetworkRequest(x.id)) }}>X</button>}
			</span>
		</div>)}
	</div>
}

function translateStatus(status: NetworkRequestStatus) : string {
	switch(status) {
	case "waitingForResponse": return "pending"
	case "succeeded": return ""
	case "failed": return "failed"
	}
}
