import { gql } from "@apollo/client"

export const GET_AUTHORS = gql`
	query {
		allAuthors {
			bookCount
			name
			born
			id
		}
	}
`
export const GET_BOOKS = gql`
	query {
		allBooks {
			title
			author
			published
		}
	}
`
export const ADD_BOOK = gql`
	mutation addBookMutation( # in order for us to be able to
		# use dynamic variables we must also name our query or in
		# this case mutation
		$title: String!
		$genres: [String!]!
		$published: Int!
		$author: String!
	) {
		addBook( # the actual mutation query
			title: $title
			genres: $genres
			published: $published
			author: $author
		) {
			title
		}
	}
`
export const EDIT_AUTHOR = gql`
	mutation editAuthorMutation($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			name
		}
	}
`
