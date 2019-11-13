const SQL = require("sequelize");

const createStore = config => {
  const db = new SQL(config.database, config.user, config.password, {
    dialect: "mssql",
    host: config.server,
    dialectOptions: {
      options: {
        ...config.options
      }
    },
    define: {
      freezeTableName: true,
      timestamps: false
    }
  });
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
    DES_CONTO: SQL.STRING
  });

  const tipoDocumenti = db.define("caxx_tipo_documento", {
    CDA_MODULO: {
      type: SQL.STRING,
      primaryKey: true
    },
    DES_MODULO: SQL.STRING
  });

  const branche = db.define("_branca", {
    BRANCA: {
      type: SQL.STRING,
      primaryKey: true
    },
    DES_BRANCA: SQL.STRING
  });
  const pazienti = db.define("pazienti", {
    PZ_ID: {
      type: SQL.STRING,
      primaryKey: true
    }
  });

  return { db, medici, pagamenti, tipoDocumenti, branche, pazienti };
};

module.exports = {
  createStore
};
