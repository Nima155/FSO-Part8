import { useQuery } from "@apollo/client"
import React from "react"
import { GET_AUTHORS } from "../queries"
import BirthYearEditForm from "./BirthYearEditForm"

const Authors = (props) => {
	const authors = useQuery(GET_AUTHORS) // fetch on every render
	if (!props.show || !authors.data) {
		return null
	}
	// console.log(authors.data)
	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.data.allAuthors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<BirthYearEditForm authors={authors.data.allAuthors} />
		</div>
	)
}

export default Authors
