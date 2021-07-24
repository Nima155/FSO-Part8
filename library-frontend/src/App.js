import React, { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/Login"
import { useApolloClient } from "@apollo/client"
import Recommend from "./components/Recommend"
const App = () => {
	const [page, setPage] = useState("authors")
	const [token, setToken] = useState(null)
	const client = useApolloClient()
	function onLogout() {
		window.localStorage.clear() // removing the token from the local storage
		setToken(null) // causing a re-render
		client.resetStore() // clearing the cache for safety
	}

	return (
		<div>
			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>

				{!window.localStorage.getItem("userInfo") ? (
					<button onClick={() => setPage("login")}>login</button>
				) : (
					<>
						<button onClick={() => setPage("add")}>add book</button>
						<button onClick={() => setPage("recommend")}>recommend</button>
						<button onClick={onLogout}>Logout</button>
					</>
				)}
			</div>

			<Authors show={page === "authors"} />

			<Books show={page === "books"} />

			<NewBook show={page === "add"} />

			<Login show={page === "login"} setToken={setToken} />
			<Recommend show={page === "recommend"} />
		</div>
	)
}

export default App
