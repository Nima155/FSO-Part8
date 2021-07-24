const { gql } = require("apollo-server-express")
const token = gql`
	type Token {
		value: String!
	}
`
module.exports = token
