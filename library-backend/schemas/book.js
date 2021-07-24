const {
	gql,
	UserInputError,
	AuthenticationError,
} = require("apollo-server-express")
const asyncHellAvoider = require("../utils/helpers")
const Author = require("../models/author")
const Book = require("../models/book")
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()
const book = gql`
	extend type Subscription {
		bookAdded: Book!
	}
	extend type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book
	}
	extend type Query {
		bookCount: Int!
		allBooks(author: String, genre: String): [Book!]!
	}
	type Book {
		title: String!
		published: Int!
		author: Author!
		books: [String!]!
		genres: [String!]!
		id: ID!
	}
`
const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),

		allBooks: async (root, { author, genre }) => {
			if (!author && !genre) {
				return Book.find({}).populate("author")
			}
			const [foundAuthor, err] = await asyncHellAvoider(
				Author.findOne({ name: author })
			)
			const queryObject = {}
			if (foundAuthor) {
				queryObject.author = foundAuthor
			}
			if (genre) {
				queryObject.genres = { $in: [genre] } // Mongo query
			}

			return Book.find(queryObject).populate("author")
		},
	},
	Mutation: {
		// we use mutation to update our database or in this case just the arrays that we have
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser)
				throw new AuthenticationError("Only registered users can add books")
			if (await Book.findOne({ title: args.title })) {
				// error handling using types defined by Apollo
				throw new UserInputError("Title must be unique", {
					invalidArgs: args.title,
				})
			}
			let author = await Author.findOne({ name: args.author })
			if (!author) {
				// if author is not in the database, add the author
				// authors = authors.concat({ name: args.author, id: uuidv1() })

				const [newAuthor, error] = await asyncHellAvoider(
					new Author({ name: args.author }).save()
				)
				if (error) throw new UserInputError(error.message)

				author = newAuthor
			}

			let [newBook, error] = await asyncHellAvoider(
				new Book({ ...args, author: author }).save()
			) // save the new book
			if (error) throw new UserInputError(error.message) // error handling using Apollo
			author.books = author.books.concat(newBook.id)
			await author.save()
			newBook = await Book.populate(newBook, { path: "author" })

			pubsub.publish("BOOK_ADDED", { bookAdded: newBook })

			return newBook
		},
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
		},
	},
}

module.exports = { resolvers, book }
