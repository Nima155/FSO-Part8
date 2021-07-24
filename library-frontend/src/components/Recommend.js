import React, { useEffect } from "react"
// import { GET_BOOKS_GENRE, USER_INFO } from "../queries"
import GET_BOOKS_GENRE from "../graphql/queries/booksByGenre"
import USER_INFO from "../graphql/queries/userinfo"
import { useLazyQuery } from "@apollo/client"
export default function Recommend({ show }) {
	const [getBooks, books] = useLazyQuery(GET_BOOKS_GENRE, {
		fetchPolicy: "cache-and-network",
	}) // fetch on event
	const [getUser, me] = useLazyQuery(USER_INFO) // fetch on event

	useEffect(() => {
		if (me.data && show) {
			getBooks({ variables: { genre: me.data.me.favoriteGenre } })
		}
	}, [me.data])

	if (!show) return null
	if (!me.called) getUser() // to save us an extra render
	if (me.loading || !books.called || books.loading) {
		return <p>Loading...</p>
	}
	return (
		<>
			<h2>Recommendations</h2>
			<p>
				books in your favorite genre <strong>{me.data.me.favoriteGenre}</strong>
			</p>
			<table>
				<tbody>
					<tr>
						<th>book</th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.data.allBooks.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
