
export const typeDefs = `#graphql

  input inputCreateContainers {
    numContainers: Int
    station: String
    country: String
  }

  
  type Mutation {
    pdfGenerator(createContainers: inputCreateContainers): String
  }

  type Query {
    hello: String
  }
`
