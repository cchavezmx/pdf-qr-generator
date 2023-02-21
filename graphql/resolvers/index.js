import * as dotenv from 'dotenv'
import { pdfGenerator, pdfRegenerator } from '../../utils/pdfGenerator.js'
import fetch from 'node-fetch'
import { GraphQLError } from 'graphql'
import redisClient from '../../utils/redis.js'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()
const API_99 = process.env.API_99
const CREATE_CONTAINERS = `
  mutation ($numContainers: Int!, $station: String!, $country: String!) {
    createContainers(
      numContainers: $numContainers
      station: $station
      country: $country
    ) {
      pdfUrl
      containers {
        id
        tag
      }
    }
  }
`

export const resolvers = {
  Mutation: {
    pdfGenerator: async (_, { createContainers }) => {
      const { numContainers, station, country } = createContainers
      try {
        const containers = await fetch(API_99, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: CREATE_CONTAINERS,
            variables: {
              numContainers,
              station,
              country
            }
          })
        })
          .then((res) => res.json())
          .then((res) => res.data.createContainers)
          .catch((error) => console.log('🚀 ~ file: index.js:48 ~ pdfGenerator: ~ error:', error))
        const uuid = uuidv4()
        redisClient.set(uuid, JSON.stringify({ containers: containers.containers, country, station }))
        const pdf = await pdfGenerator(containers.containers, country, station)
        return { pdfBase64: pdf, uuid }
      } catch (error) {
        console.log('🚀 ~ file: index.js:50 ~ pdfGenerator: ~ error:', error)
        throw new GraphQLError('Error in pdfGenerator.js')
      }
    },
    pdfRegenerator: async (_, { uuid }) => {
      try {
        const pdf = await pdfRegenerator(uuid)
        return { pdfBase64: pdf, uuid }
      } catch (error) {
        throw new GraphQLError('Error in pdfGenerator.js')
      }
    }
  }
}
