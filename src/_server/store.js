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

  /* const fatture = db.define("fatture", {
    MED_ID: {
      type: SQL.STRING,
      primaryKey: true
    },
    COGNOME: SQL.STRING,
    NOME: SQL.STRING,
    TITOLO: SQL.STRING
  });
 */
  return { medici };
};

module.exports = {
  createStore,
  db
};
