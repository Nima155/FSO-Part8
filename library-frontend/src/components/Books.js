import { useLazyQuery } from "@apollo/client"
import React, { useState } from "react"
import GET_BOOKS from "../graphql/queries/booksWithoutFilter"

const Books = (props) => {
	const [getBooks, books] = useLazyQuery(GET_BOOKS, {
		fetchPolicy: "cache-and-network", // always fetch from the network as well and check against
		//the cache, if server data is diff then update the cache
	})

	const [category, setCategory] = useState("All")
	if (!books.called) getBooks()
	if (!props.show || !books.data) {
		return null
	}

	function onCategoryChange(cat) {
		getBooks()
		setCategory(cat)
	}
	const categories = new Set(books.data.allBooks.map((a) => a.genres).flat())
	return (
		<div>
			<h2>books</h2>
			<p>in genre {category}</p>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.data.allBooks
						.filter((a) =>
							category !== "All" ? a.genres.includes(category) : a
						)
						.map((a) => (
							<tr key={a.title}>
								<td>{a.title}</td>
								<td>{a.author.name}</td>
								<td>{a.published}</td>
							</tr>
						))}
				</tbody>
			</table>
			{[...categories].map((cat) => (
				<button key={cat} onClick={(e) => onCategoryChange(cat)}>
					{cat}
				</button>
			))}
			<button onClick={(e) => onCategoryChange("All")}>all</button>
		</div>
	)
}

export default Books
