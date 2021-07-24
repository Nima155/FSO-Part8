import { gql } from "@apollo/client"

const GET_AUTHORS = gql`
	query {
		allAuthors {
			bookCount
			name
			born
			id
		}
	}
`
export default GET_AUTHORS
