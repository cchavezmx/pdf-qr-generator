import * as dotenv from 'dotenv'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './graphql/schema/index.js'
import { resolvers } from './graphql/resolvers/index.js'

dotenv.config()

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server)

console.log(`🚀 Server ready at ${url}`)
