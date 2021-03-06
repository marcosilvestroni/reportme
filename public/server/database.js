const { DataSource } = require("apollo-datasource");
const queries = require("./queries");
const SQL = require("sequelize");

class databaseAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAllMedici() {
    const found = await this.store.medici.findAll({
      where: {
        TITOLO: {
          [SQL.Op.ne]: "N.A."
        }
      }
    });
    return found && found.length ? found : [];
  }

  async getAllFatture() {
    const found = await  this.store.db.query(queries.fatture);
    // eslint-disable-next-line no-unused-vars
    const [results, meta] = found;
    return results && results.length
      ? results.map(elm => {
        const dt = new Date(elm.DATA_FATTURA)
        return {
          _id: `${dt.getTime()}${elm.NUM_FATTURA}`,
          ...elm
        }})
      : [];
  }

  async getAllPagamenti() {
    const found = await this.store.pagamenti.findAll();

    return found && found.length ? found : [];
  }

  async getAllTipoDocumenti() {
    const found = await this.store.tipoDocumenti.findAll();

    return found && found.length ? found : [];
  }

  async getAllRigheFatture() {
    const found = await  this.store.db.query(queries.righe_fatture);
    // eslint-disable-next-line no-unused-vars
    const [results, meta] = found;
    const heads = await this.getAllFatture();

    return results && results.length
      ? results.map(elm => {
        const dt = new Date(elm.DATA_FATTURA)
        const _refFattura =`${dt.getTime()}${elm.NUM_FATTURA}`
        return {
          _id: `${dt.getTime()}${elm.NUM_FATTURA}${elm.NUMERO_RIGA}`,
          _refFattura,
          ...elm,
          FATTURA:heads.filter(fat=>fat._id === _refFattura)[0]

        }})
      : [];
  }

  async getAllBranche() {
    const found = await this.store.branche.findAll();

    return found && found.length ? found : [];
  }

  async getAllPazienti() {
    const found = await this.store.pazienti.findAll();

    return found && found.length ? found : [];
  }
}

module.exports = databaseAPI;
