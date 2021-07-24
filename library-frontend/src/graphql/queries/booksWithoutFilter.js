import { gql } from "@apollo/client"
import BOOK_FRAGMENT from "../fragments/bookinfo"
const GET_BOOKS = gql`
	# Using a fragment
	${BOOK_FRAGMENT}
	query {
		allBooks {
			...BookDetails # using a fragment
		}
	}
`
export default GET_BOOKS
