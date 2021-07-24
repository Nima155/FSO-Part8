import { gql } from "@apollo/client"
import BOOK_FRAGMENT from "../fragments/bookinfo"
const BOOK_ADDED = gql`
	${BOOK_FRAGMENT}
	subscription {
		bookAdded {
			...BookDetails
			author {
				name
				id
				bookCount
				born
			}
		}
	}
`
export default BOOK_ADDED
