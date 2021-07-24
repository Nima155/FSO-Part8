const { gql, AuthenticationError } = require("apollo-server-express")
const asyncHellAvoider = require("../utils/helpers")
const Author = require("../models/author")

const author = gql`
	extend type Mutation {
		editAuthor(name: String!, setBornTo: Int!): Author
	}
	extend type Query { # extend allows us to add fields to an already existing type, in this case query
		authorCount: Int!
		allAuthors: [Author!]!
	}
	type Author {
		name: String! # ! => not nullable.
		bookCount: Int!
		books: [String!]!
		born: Int # can be null
		id: String!
	}
`
const resolver = {
	Query: {
		authorCount: () => Author.collection.countDocuments(),

		allAuthors: async () => {
			const [authors, err] = await asyncHellAvoider(Author.find({}))
			return authors
		},
	},
	Author: {
		bookCount: (root) => {
			// a custom resolver for bookCount
			return root.books.length
		},
	},
	Mutation: {
		editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
			if (!currentUser)
				throw new AuthenticationError(
					"Only logged in users can edit author fields"
				)
			const [author, err] = await asyncHellAvoider(Author.findOne({ name }))
			if (author) {
				author.born = setBornTo

				author.save()
			}

			return author
		},
	},
}

module.exports = { resolver, author }
