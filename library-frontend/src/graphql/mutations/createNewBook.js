import { gql } from "@apollo/client"

const ADD_BOOK = gql`
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
export default ADD_BOOK
