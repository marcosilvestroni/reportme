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
      branche: [String]
      forRow: Boolean
    ): FattureConnection!
    pagamenti: [Pagamenti]!
    tipoDocumenti: [TipoDocumenti]!
    branche: [Branche]!
    righe(
      after: String
      medico: String
      pagamento: String
      tipo: String
      fromDate: Float
      toDate: Float
      branche: [String]
      denti: Int
    ): RigheConnection!
    export(fromDate: Float, toDate: Float): String
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
    PZ_ID: String
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
    RIGHE: [RigheFattura]!
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
    totalAmount: Float
    totalTaxes: Float
    totalStamps: Float
    totalServices: Float
  }
  type TipoDocumenti {
    CDA_MODULO: String
    DES_MODULO: String
  }
  type Branche {
    BRANCA: String
    DES_BRANCA: String
  }

  type RigheFattura {
    _id: ID
    _refFattura: String
    CODICE_LISTINO: String
    MEDICO: Medici
    BRANCA: Branche
    PREZZO: String
    DENTI: String
    DESCRIZIONE_RIGA: String
    NUMERO_RIGA: String
    FATTURA: Fatture
  }
  type RigheConnection {
    cursor: String
    hasMore: Boolean!
    righe: [RigheFattura]!
    meta: MetaRighe
  }
  type MetaRighe {
    totalCount: Int
    totalAmount: Float
    totalTaxes: Float
    totalStamps: Float
    totalServices: Float
  }
`;
