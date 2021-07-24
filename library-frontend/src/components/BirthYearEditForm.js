import { useMutation } from "@apollo/client"
import React, { useState } from "react"

import EDIT_AUTHOR from "../graphql/mutations/editAuthor"
import GET_AUTHORS from "../graphql/queries/authors"
export default function BirthYearEditForm({ authors }) {
	const [selectedAuthor, setSelectedAuthor] = useState(
		authors.length && authors[0].name
	)

	const [editYearMutation] = useMutation(EDIT_AUTHOR, {
		update: (store, { data }) => {
			// update is called after every mutation
			const authors = store.readQuery({ query: GET_AUTHORS })
			store.writeQuery({
				query: GET_AUTHORS,
				data: {
					...authors,
					allAuthors: authors.allAuthors.map((ele) =>
						ele.name === selectedAuthor
							? { ...ele, born: data.editAuthor.born }
							: ele
					),
				},
			})
		}, // update the view by fetching all authors again
		onError: () => {},
	})
	const onSelectChange = (e) => {
		setSelectedAuthor(e.target.value)
	}

	const submitHandler = (e) => {
		e.preventDefault()

		editYearMutation({
			variables: {
				name: selectedAuthor,
				setBornTo: +e.target.YOB.value,
			},
		})
	}
	return (
		<>
			<h3>Edit author</h3>
			<form onSubmit={submitHandler}>
				<select
					value={selectedAuthor}
					onChange={onSelectChange}
					name="authorName"
				>
					{authors.map((ele) => (
						<option value={ele.name} key={ele.id}>
							{ele.name}
						</option>
					))}
				</select>
				{/* <div>
				<label htmlFor="author-name">Name:</label>

				<input
					id="author-name"
					type="text"
					placeholder="Author name"
					name="authorName"
				></input>
			</div> */}
				<div>
					<label htmlFor="author-year">Birth Year:</label>
					<input id="author-year" type="number" name="YOB"></input>
				</div>
				<button type="submit">Submit Edit</button>
			</form>
		</>
	)
}
