import * as dotenv from 'dotenv'
import pdfGenerator from '../../utils/pdfGenerator.js'
import fetch from 'node-fetch'
import { GraphQLError } from 'graphql'

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

        const pdf = await pdfGenerator(containers.containers, country)
        return pdf
      } catch (error) {
        throw new GraphQLError('Error in pdfGenerator.js')
      }
    }
  }
}
