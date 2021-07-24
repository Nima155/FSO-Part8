import { gql } from "@apollo/client"
const BOOK_FRAGMENT = gql`
	fragment BookDetails on Book {
		# Defining a fragment named BookDetails on type Book
		title
		author {
			name
		}
		genres
		published
		id
	}
`

export default BOOK_FRAGMENT
