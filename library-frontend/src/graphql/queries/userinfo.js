import { gql } from "@apollo/client"
const USER_INFO = gql`
	query {
		me {
			favoriteGenre
		}
	}
`
export default USER_INFO
