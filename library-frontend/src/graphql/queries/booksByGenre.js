import { gql } from "@apollo/client"
import BOOK_FRAGMENT from "../fragments/bookinfo"

const GET_BOOKS_GENRE = gql`
	${BOOK_FRAGMENT}
	query getBooksOfGenre($genre: String!) {
		allBooks(genre: $genre) {
			...BookDetails
		}
	}
`
export default GET_BOOKS_GENRE
