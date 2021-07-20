import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import {
	ApolloProvider,
	HttpLink,
	ApolloClient,
	InMemoryCache,
} from "@apollo/client"
const client = new ApolloClient({
	// setting up the client side of apollo
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: "http://localhost:4000/", // back end server address
	}),
})

ReactDOM.render(
	// we apollo provider so that all components can have access to the client object
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
)
