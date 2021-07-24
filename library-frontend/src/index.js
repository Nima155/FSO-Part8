import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import {
	ApolloProvider,
	HttpLink,
	ApolloClient,
	InMemoryCache,
	split,
} from "@apollo/client"

import { getMainDefinition } from "@apollo/client/utilities"
import { WebSocketLink } from "@apollo/client/link/ws"
import { setContext } from "@apollo/client/link/context"

const apolloLink = setContext((_, { headers }) => {
	// setContext to set the right authorization
	// header in case there is a token
	const token = window.localStorage.getItem("userInfo")
	return {
		headers: {
			...headers,
			authorization: token ? `bearer ${token}` : null,
		},
	}
})
// websocket connection for subscriptions
const wsLink = new WebSocketLink({
	uri: "ws://localhost:4000/graphql",
	options: { reconnect: true },
})
// HTTP connection for everything else
const serverAddress = new HttpLink({
	uri: "http://localhost:4000/graphql", // back end server address
})

const splitLink = split(
	({ query }) => {
		const def = getMainDefinition(query)
		return (
			def.kind === "OperationDefinition" && def.operation === "subscription"
		)
	},
	wsLink, // execute this link if call back result is true
	apolloLink.concat(serverAddress) // else execute this link..  setContext returns an array which
	// we then append the serverAddress to
)

const client = new ApolloClient({
	// setting up the client side of apollo
	cache: new InMemoryCache(),
	link: splitLink,
})

ReactDOM.render(
	// we apollo provider so that all components can have access to the client object
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
)
