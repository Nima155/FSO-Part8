require("dotenv").config({}) // for using environment variables
const { ApolloServer, gql } = require("apollo-server-express")
// different graphQL type decls
const {
	author: AuthorSchema,
	resolver: AuthorResolver,
} = require("./schemas/author")
const { book: BookSchema, resolvers: BookResolver } = require("./schemas/book")
const TokenSchema = require("./schemas/token")
const { user: UserSchema, resolvers: UserResolver } = require("./schemas/user")
var merge = require("lodash.merge")

// CORS
const cors = require("cors")
const express = require("express")

const { execute, subscribe } = require("graphql")
const { createServer } = require("http")
const { SubscriptionServer } = require("subscriptions-transport-ws")
const { makeExecutableSchema } = require("@graphql-tools/schema")

const jwt = require("jsonwebtoken")
// const { v1: uuidv1 } = require("uuid") // for generating id's
const mongoose = require("mongoose")

const User = require("./models/user")
const DB_URL = `mongodb+srv://Nima155:${process.env.DB_PASS}@cluster0.bajga.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose
	.connect(DB_URL, {
		useNewUrlParser: true, // use the new url parser instead of the old one
		useUnifiedTopology: true, // using mongoDB drivers new connection management engine
		useFindAndModify: false, // findOneAndUpdate and Remove will use findOneAndUpdate instead of findAndModify
		useCreateIndex: true, // use createIndex() instead of ensureIndex(), which is deprecated
	})
	.then(() => {
		console.log("Connected to the database")
	})
	.catch((err) => {
		console.log(DB_URL)
	})
mongoose.set("debug", true)
const typeDefs = gql`
	type Mutation { # special type used to add to a database
		_empty: String
	}
	# Defining types which we query on
	type Query { # We extend Query, Subscription and Mutation
		_empty: String # we can't have empty types so we use _empty: String as like a placeholder
	}
	type Subscription {
		_empty: String
	}
`
const resolvers = {}

;(async function () {
	// Required logic for integrating with Express
	const app = express()

	app.use(cors())

	const httpServer = createServer(app)

	const schema = makeExecutableSchema({
		// so that we can pass this to both the subscriptionServer and the Apollo server
		typeDefs: [typeDefs, BookSchema, UserSchema, AuthorSchema, TokenSchema],
		resolvers: merge(resolvers, AuthorResolver, BookResolver, UserResolver), // merge comes from lodAsh
	})

	// Same ApolloServer initialization as before
	const server = new ApolloServer({
		schema,
		context: async ({ req }) => {
			// the object returned by context is given to all resolvers.. used for authorization
			const auth = req ? req.headers.authorization : null
			if (auth && auth.toLowerCase().startsWith("bearer")) {
				const decodedToken = jwt.verify(auth.substring(7), process.env.SEKRET)
				return { currentUser: await User.findById(decodedToken.id) }
			}
			return {}
		},
	})

	await server.start()

	server.applyMiddleware({ app })

	const subscriptionServer = SubscriptionServer.create(
		{
			// This is the `schema` we just created.
			schema,
			// These are imported from `graphql`.
			execute,
			subscribe,
		},
		{
			// This is the `httpServer` we created in a previous step.
			server: httpServer,
			// This `server` is the instance returned from `new ApolloServer`.
		}
	)

	;[("SIGINT", "SIGTERM")].forEach((signal) => {
		process.on(signal, () => subscriptionServer.close())
	})
	httpServer.listen(4000, () =>
		console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
	)

	// await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
})()
