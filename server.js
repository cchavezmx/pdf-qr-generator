import * as dotenv from 'dotenv'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './graphql/schema/index.js'
import { resolvers } from './graphql/resolvers/index.js'

dotenv.config()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
})

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 }
})

console.log(`🚀 Server ready at ${url}`)
