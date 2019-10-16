const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    medici: [Medici]!
    fattura(numero: String!, date: String): Fatture
    fatture(
      after: String
      medico: String
      pagamento: String
      tipo: String
      fromDate: Float
      toDate: Float
    ): FattureConnection!
    pagamenti: [Pagamenti]!
  }
  type Medici {
    MED_ID: ID!
    COGNOME: String
    NOME: String
    TITOLO: String
  }
  type Fatture {
    _id: ID
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
    PAG_DESC: String
    PAG_COD: String
  }

  type Pagamenti {
    CDA_CONTO: String
    DES_CONTO: String
  }

  type FattureConnection {
    cursor: String
    hasMore: Boolean!
    fatture: [Fatture]!
    meta: MetaFatture
  }

  type MetaFatture {
    totalCount: Int
    totalAmount: Int
    totalTaxes: Int
    totalStamps: Int
    totalServices: Int
  }
`;
