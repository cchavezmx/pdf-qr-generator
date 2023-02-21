
export const typeDefs = `#graphql

  input inputCreateContainers {
    numContainers: Int
    station: String
    country: String
  }

  type PDF {
    pdfBase64: String
    uuid: String
  }
  
  type Mutation {
    pdfGenerator(createContainers: inputCreateContainers): PDF,
    pdfRegenerator(uuid: String): PDF
  }

  type Query {
    hello: String
  }
`
