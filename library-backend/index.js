const { ApolloServer, gql, UserInputError } = require("apollo-server")
const { v1: uuidv1 } = require("uuid")
const mongoose = require("mongoose")
require("dotenv").config()
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
		console.log("Could not connect to the server")
	})
const typeDefs = gql`
	type Mutation { # special type used to add to a database
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book
		editAuthor(name: String!, setBornTo: Int!): Author
	}
	# Defining types which we query on
	type Author {
		name: String! # ! => not nullable.
		bookCount: Int!
		born: Int # can be null
		id: String!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}
	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
	}
`

const resolvers = {
	// resolvers Determine how queries are responded to
	Query: {
		bookCount: () => books.length,
		authorCount: () => authors.length,
		allBooks: (root, { author, genre }) => {
			if (!author && !genre) {
				return books
			}

			return books.filter(
				(ele) =>
					ele.author === (author ? author : ele.author) &&
					ele.genres.indexOf(genre ? genre : ele.genres[0]) !== -1
			)
		},
		allAuthors: () =>
			authors.map((ele) => {
				return {
					...ele,
					bookCount: books.filter((v) => v.author === ele.name).length,
				}
			}),
	},
	Mutation: {
		// we use mutation to update our database or in this case just the arrays that we have
		addBook: (root, args) => {
			if (books.find((ele) => ele.title === args.title)) {
				// error handling using types defined by Apollo
				throw new UserInputError("Title must be unique", {
					invalidArgs: args.title,
				})
			}
			if (!authors.find((ele) => ele.name === args.author)) {
				authors = authors.concat({ name: args.author, id: uuidv1() })
			}
			const newBook = { ...args, id: uuidv1() }
			books = books.concat(newBook)
			return newBook
		},
		editAuthor: (root, { name, setBornTo }) => {
			const author = authors.find((ele) => ele.name === name)
			if (author) {
				author.born = setBornTo
				return author
			}
			return null
		},
	},
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`)
})
