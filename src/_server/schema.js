const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    medici: [Medici]!
    fatture: [Fatture]!
  }

  type Medici {
    MED_ID: ID!
    COGNOME: String
    NOME: String
    TITOLO: String
  }
  type Fatture {
    MED_ID: String
    PZ_INT: String
    COGNOME: String
    NOME: String
    LOC: String
    CAP: String
    PROV: String
    IND: String
    CF: String
    NUM_FATTURA: String
    DATA_FATTURA: String
    TIPO_FATTURA: String
    NOME_MEDICO: String
    COGNOME_MEDICO: String
    IMPONIBILE: String
    IMPOSTA: String
    TOTALE: String
    BOLLI: String
    PRESTAZIONI: String
    RIF_NUM_FATTURA: String
    RIF_DATA_FATTURA: String
  }
`;
