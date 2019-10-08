module.exports = {
  Query: {
    medici: (_, __, { dataSources }) => dataSources.databaseAPI.getAllMedici(),
    fatture: (_, __, { dataSources }) => dataSources.databaseAPI.getAllFatture()
  }
};
