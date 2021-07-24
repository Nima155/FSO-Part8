const { gql, UserInputError } = require("apollo-server-express")
const jwt = require("jsonwebtoken")
const asyncHellAvoider = require("../utils/helpers")
const COMMON_PASSWORD = "GIGI123BUFFON"
const User = require("../models/user")

const user = gql`
	extend type Mutation {
		createUser(username: String!, favoriteGenre: String!): User
		login(username: String!, password: String!): Token
	}
	extend type Query {
		me: User
	}
	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}
`

const resolvers = {
	Query: {
		me: (root, args, { currentUser }) => {
			return currentUser
		},
	},
	Mutation: {
		createUser: async (root, { username, favoriteGenre }) => {
			const user = new User({ username, favoriteGenre })
			const [data, err] = await asyncHellAvoider(user.save())
			if (err) throw new UserInputError(err.message)
			return data
		},
		login: async (root, { username, password }) => {
			const [data, err] = await asyncHellAvoider(User.findOne({ username }))

			if (!data || password !== COMMON_PASSWORD) {
				throw new UserInputError("wrong credentials")
			}

			return {
				value: jwt.sign(
					{ id: data.id, username: data.username },
					process.env.SEKRET
				),
			}
		},
	},
}

module.exports = { user, resolvers }
