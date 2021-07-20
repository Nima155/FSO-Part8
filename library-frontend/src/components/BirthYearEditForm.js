import { useMutation } from "@apollo/client"
import React, { useState } from "react"
import { EDIT_AUTHOR, GET_AUTHORS } from "../queries"

export default function BirthYearEditForm({ authors }) {
	const [selectedAuthor, setSelectedAuthor] = useState(authors[0])

	const [editYearMutation] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: GET_AUTHORS }], // update the view by fetching all authors again
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
