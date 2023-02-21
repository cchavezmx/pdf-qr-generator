import pdfGenerator from '../../utils/pdfGenerator.js'

export const resolvers = {
  Mutation: {
    pdfGenerator: async (_, { createContainers }) => {
      const { numContainers, station, country } = createContainers
      const pdf = await pdfGenerator(numContainers, station, country)
      return pdf
    }
  }
}
