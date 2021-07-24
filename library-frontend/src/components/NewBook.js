import React, { useState } from "react"
import { useApolloClient, useMutation } from "@apollo/client"
import GET_BOOKS from "../graphql/queries/booksWithoutFilter"
import GET_AUTHORS from "../graphql/queries/authors"
import ADD_BOOK from "../graphql/mutations/createNewBook"
import BOOK_ADDED from "../graphql/subscriptions/onBookAdded"
import { useSubscription } from "@apollo/client"
const NewBook = (props) => {
	const [title, setTitle] = useState("")
	const [author, setAuthor] = useState("")
	const [published, setPublished] = useState("")
	const [genre, setGenre] = useState("")
	const [genres, setGenres] = useState([])
	const client = useApolloClient()

	useSubscription(BOOK_ADDED, {
		onSubscriptionData: ({ subscriptionData }) => {
			// console.log(subscriptionData.data.bookAdded)
			const dataInCache = client.readQuery({ query: GET_BOOKS })
			if (
				!dataInCache.allBooks.filter(
					// preventing the same book from being added to the list twice
					(ele) => ele.id === subscriptionData.data.bookAdded.id
				).length
			) {
				const authors = client.readQuery({ query: GET_AUTHORS })
				console.log(subscriptionData.data.bookAdded.author)
				client.writeQuery({
					// updating the cache...
					query: GET_AUTHORS,
					data: {
						allAuthors: !authors.allAuthors.find(
							(ele) => ele.name === subscriptionData.data.bookAdded.author.name
						)
							? authors.allAuthors.concat(
									subscriptionData.data.bookAdded.author
							  )
							: authors.allAuthors.map((ele) =>
									ele.id === subscriptionData.data.bookAdded.author.id
										? { ...ele, ...subscriptionData.data.bookAdded.author }
										: ele
							  ),
					},
				})

				client.writeQuery({
					query: GET_BOOKS,
					data: {
						allBooks: dataInCache.allBooks.concat(
							subscriptionData.data.bookAdded
						),
					},
				})
				window.alert(
					`${subscriptionData.data.bookAdded.title} by ${subscriptionData.data.bookAdded.author.name} added to the database`
				)
			}
		},
	})
	const [addBookMutation] = useMutation(ADD_BOOK, {
		// refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHORS }], // refetch on addition so that views are updated
		onError: (error) => {
			// do nothing but dont crash
		},
	})
	if (!props.show) {
		return null
	}

	const submit = async (event) => {
		event.preventDefault()
		addBookMutation({
			variables: { title, author, published: +published, genres }, // adding a new book... using dynamic variables
		})
		setTitle("")
		setPublished("")
		setAuthor("")
		setGenres([])
		setGenre("")
	}

	const addGenre = () => {
		setGenres(genres.concat(genre))
		setGenre("")
	}

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					title
					<input
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author
					<input
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					published
					<input
						type="number"
						value={published}
						onChange={({ target }) => setPublished(target.value)}
					/>
				</div>
				<div>
					<input
						value={genre}
						onChange={({ target }) => setGenre(target.value)}
					/>
					<button onClick={addGenre} type="button">
						add genre
					</button>
				</div>
				<div>genres: {genres.join(" ")}</div>
				<button type="submit">create book</button>
			</form>
		</div>
	)
}

export default NewBook
