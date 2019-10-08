const { DataSource } = require("apollo-datasource");
const queries = require("./queries");
const { db } = require("./store");

class databaseAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAllMedici() {
    const found = await this.store.medici.findAll();
    return found && found.length ? found : [];
  }

  async getAllFatture() {
    const found = await db.query(queries.fatture);
    const [results, meta] = found;
    return results && results.length ? results : [];
  }
}

module.exports = databaseAPI;
