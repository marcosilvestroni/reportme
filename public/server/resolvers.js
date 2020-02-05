const { paginateResults } = require("./utils");
const path = require("path");
const fastcsv = require("fast-csv");
const fs = require("fs");

module.exports = {
  Query: {
    medici: (_, __, { dataSources }) => dataSources.testAPI.getMedici(),
    pagamenti: (_, __, { dataSources }) => dataSources.testAPI.getPagamenti(),
    tipoDocumenti: (_, __, { dataSources }) =>
      dataSources.testAPI.getTipoDocumenti(),
    branche: (_, __, { dataSources }) => dataSources.testAPI.getBranche(),
    fattura: (_, { numero, date }, { dataSources }) => {
      return dataSources.databaseAPI.getAllFatture().then(results => {
        return results.filter(doc => doc.NUM_FATTURA === numero);
      });
    },
    righe: (
      _,
      {
        pageSize = 20,
        after,
        medico,
        pagamento,
        tipo,
        fromDate,
        toDate,
        branche = [],
        denti
      },
      { dataSources }
    ) => {
      return dataSources.testAPI
        .getRighe(medico, pagamento, tipo, fromDate, toDate, branche, denti)
        .then(results => {
          let totalAmount = 0;
          results.forEach(item => (totalAmount += item.PREZZO + item.BOLLI));

          const righe = paginateResults({
            after,
            pageSize,
            results
          });

          return {
            righe,
            cursor: righe.length ? righe[righe.length - 1].ID : null,
            hasMore: righe.length
              ? righe[righe.length - 1].ID !== results[results.length - 1].ID
              : false,
            meta: {
              totalCount: results.length,
              totalAmount
            }
          };
        });
    },
    export: (_, { fromDate, toDate }, { dataSources }) => {
      return dataSources.databaseAPI.getAllFatture().then(results => {
        let allFatture = results.filter(doc => true);

        allFatture = fromDate
          ? allFatture.filter(doc => {
              const dt = new Date(doc.DATA_FATTURA);
              return dt.getTime() >= fromDate;
            })
          : allFatture;
        allFatture = toDate
          ? allFatture.filter(doc => {
              const dt = new Date(doc.DATA_FATTURA);
              return dt.getTime() <= toDate;
            })
          : allFatture;

        const dtform = new Date();
        const dtto = new Date();
        dtform.setTime(fromDate);
        dtto.setTime(toDate);

        const nameFile = `export_${dtform.getDate()}${dtform.getMonth() +
          1}${dtform.getFullYear()}_${dtto.getDate()}${dtto.getMonth() +
          1}${dtto.getFullYear()}.csv`;

        const pathNameFile = path.join("C:\\exportsReportMe", nameFile);

        dataSources.databaseAPI.getAllPazienti().then(pazienti => {
          const charSequences = pazienti.map(p => p.PZ_ID);
          const passpartoutEncode = {
            "010001": "4", // CASSA
            "011001": "1", //BANCA BCC
            "011002": "10", //ASSEGNO
            "011003": "3", //MARCHEX
            "011004": "2", //BANCA SELLA
            "011005": "7", //COFIDIS
            "011006": "5", //UNISALUTE
            "011007": "6", //PREVIMEDICAL
            "011008": "9", //PRONTOCARE
            "011009": "8", //FASIOPEN
            "011010": "11" //COMPASS --non codificato
          };

          const dir = "C:\\exportsReportMe";

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }

          fastcsv
            .writeToPath(
              pathNameFile,
              allFatture.map(row => {
                const dt = new Date(row.DATA_FATTURA);

                const calculatedCode = charSequences.findIndex(
                  elm => elm === row.PZ_ID
                );

                return {
                  Codice: calculatedCode === 0 ? 99999 : calculatedCode, //fix array start from 0 //FUUUUUCK
                  Ragione_Sociale: "",
                  Cognome: row.COGNOME,
                  Nome: row.NOME,
                  Indirizzo: row.IND,
                  Cap: row.CAP,
                  Città: row.LOC,
                  Provincia: row.PROV,
                  Codice_Fiscale: row.CF,
                  P_Iva: row.PIVA,
                  Telefono_1: "",
                  Telefono_2: "",
                  E_Mail: "",
                  PEC: "",
                  COD_Sdi: "",
                  Nazionalita: "",
                  Paese: "",
                  Data_Documento: `${dt.getDate()}/${dt.getMonth() +
                    1}/${dt.getFullYear()}`,
                  Numero_Documento: row.NUM_FATTURA,
                  Imponibile: row.PRESTAZIONI.toString().replace(",", "."),
                  Imposte: row.IMPOSTA.toString().replace(",", "."),
                  Bollo: row.BOLLI.toString().replace(",", "."),
                  Ritenute: "",
                  Toale: row.TOTALE.toString().replace(",", "."),
                  ID_Pagamento: passpartoutEncode[row.PAG_COD],
                  Descrizione_Pagamento: row.PAG_DESC,
                  O: "IT",
                  Q: 0
                };
              }),
              {
                headers: false,
                delimiter: ";"
              }
            )
            .on("error", err => err)
            .on("finish", () => pathNameFile);
        });
        return pathNameFile;
      });
    }
  },
  Fatture: {
    RIGHE: ({ _id }, _, { dataSources }) => {
      return dataSources.databaseAPI.getAllRigheFatture().then(results => {
        return results.filter(elm => elm._refFattura === _id);
      });
    }
  },
  RigheFattura: {
    MEDICO: ({ MED_ID, MEDICO_FATTURA }, _, { dataSources }) => {
      if (MED_ID) {
        return dataSources.testAPI.getMedici(MED_ID).then(res => {
          return res[0];
        });
      } else {
        if (MEDICO_FATTURA) {
          return dataSources.testAPI.getMedici(MEDICO_FATTURA).then(res => {
            return res[0];
          });
        }
      }
    },
    BRANCA: ({ BRANCA }, _, { dataSources }) => {
      if (BRANCA) {
        return dataSources.testAPI.getBranche(BRANCA).then(res => {
          return res[0];
        });
      }
    },
    PAZIENTE: ({ PZ_ID, PZ_FATTURA }, _, { dataSources }) => {
      if (PZ_ID) {
        return dataSources.testAPI.getPazienti(PZ_ID).then(res => {
          return res[0];
        });
      } else {
        if (PZ_FATTURA) {
          return dataSources.testAPI.getPazienti(PZ_FATTURA).then(res => {
            return res[0];
          });
        }
      }
    }
  }
};
