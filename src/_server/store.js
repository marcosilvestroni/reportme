const SQL = require("sequelize");
const CONFIG = require("./config");

const db = new SQL(CONFIG.database, CONFIG.user, CONFIG.password, {
  dialect: "mssql",
  host: CONFIG.server,
  dialectOptions: {
    options: {
      ...CONFIG.options
    }
  },
  define: {
    freezeTableName: true,
    timestamps: false
  }
});

const createStore = () => {
  const medici = db.define("medici", {
    MED_ID: {
      type: SQL.STRING,
      primaryKey: true
    },
    COGNOME: SQL.STRING,
    NOME: SQL.STRING,
    TITOLO: SQL.STRING
  });

  const pagamenti = db.define("cgxx_conti_pag_v1", {
    CDA_CONTO: {
      type: SQL.STRING,
      primaryKey: true
    },
    DES_CONTO: SQL.STRING,
  });

  const tipoDocumenti = db.define("caxx_tipo_documento", {
    CDA_MODULO: {
      type: SQL.STRING,
      primaryKey: true
    },
    DES_MODULO: SQL.STRING,
  });

   return { medici, pagamenti, tipoDocumenti };
};

module.exports = {
  createStore,
  db
};
