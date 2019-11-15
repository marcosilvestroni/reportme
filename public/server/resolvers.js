const { paginateResults } = require("./utils");
const path = require("path");
const fastcsv = require("fast-csv");
const fs = require("fs");

module.exports = {
  Query: {
    medici: (_, __, { dataSources }) => dataSources.databaseAPI.getAllMedici(),
    fattura: (_, { numero, date }, { dataSources }) => {
      return dataSources.databaseAPI.getAllFatture().then(results => {
        return results.filter(doc => doc.NUM_FATTURA === numero);
      });
    },
    fatture: async (
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
        forRow = false
      },
      { dataSources }
    ) => {
      const righeFattura = await dataSources.databaseAPI.getAllRigheFatture();
      return dataSources.databaseAPI.getAllFatture().then(results => {
        const applyFilter = (dataset, check) => {
          return dataset.filter(check);
        };
        let allFatture = applyFilter(results, doc => true);
        let totalCount = 0,
          totalAmount = 0,
          totalTaxes = 0,
          totalStamps = 0,
          totalServices = 0;

        if (
          !pagamento &&
          !tipo &&
          !fromDate &&
          !toDate &&
          !medico &&
          branche.length === 0
        ) {
          allFatture = [];
        }

        allFatture = pagamento
          ? allFatture.filter(doc => doc.PAG_COD === pagamento)
          : allFatture;
        allFatture = tipo
          ? allFatture.filter(doc => doc.TIPO_FATTURA === tipo)
          : allFatture;
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

        allFatture = !medico
          ? allFatture
          : !forRow
          ? allFatture.filter(doc => doc.MED_ID === medico)
          : allFatture.filter(doc =>
              righeFattura
                .filter(row => row.MED_ID === medico)
                .map(elm => elm._refFattura)
                .includes(doc._id)
            );

        allFatture =
          branche.length === 0
            ? allFatture
            : allFatture.filter(doc =>
                righeFattura
                  .filter(row => branche.includes(row.BRANCA))
                  .map(elm => elm._refFattura)
                  .includes(doc._id)
              );

        allFatture.forEach(doc => {
          totalAmount += doc.TOTALE;
          totalTaxes += doc.IMPOSTA;
          totalStamps += doc.BOLLI;
          totalServices += doc.PRESTAZIONI;
        });
        totalCount = allFatture.length;

        const fatture = paginateResults({
          after,
          pageSize,
          results: allFatture
        });
        return {
          fatture,
          cursor: fatture.length ? fatture[fatture.length - 1]._id : null,
          hasMore: fatture.length
            ? fatture[fatture.length - 1]._id !==
              allFatture[allFatture.length - 1]._id
            : false,
          meta: {
            totalCount,
            totalAmount,
            totalTaxes,
            totalStamps,
            totalServices
          }
        };
      });
    },
    pagamenti: (_, __, { dataSources }) =>
      dataSources.databaseAPI.getAllPagamenti(),
    tipoDocumenti: (_, __, { dataSources }) =>
      dataSources.databaseAPI.getAllTipoDocumenti(),
    branche: (_, __, { dataSources }) =>
      dataSources.databaseAPI.getAllBranche(),
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
      return dataSources.databaseAPI.getAllRigheFatture().then(results => {
        let allRighe = [];

        let totalCount = 0,
          totalAmount = 0,
          totalTaxes = 0,
          totalStamps = 0,
          totalServices = 0;

        if (
          !pagamento &&
          !tipo &&
          !fromDate &&
          !toDate &&
          !medico &&
          branche.length === 0 &&
          !denti
        ) {
          allRighe = [];
        } else {
          allRighe = results.filter(doc => doc.FATTURA);
        }

        allRighe = pagamento
          ? allRighe.filter(doc => doc.FATTURA.PAG_COD === pagamento)
          : allRighe;

        allRighe = tipo
          ? allRighe.filter(doc => doc.FATTURA.TIPO_FATTURA === tipo)
          : allRighe;

        allRighe = fromDate
          ? allRighe.filter(doc => {
              const dt = new Date(doc.FATTURA.DATA_FATTURA);
              return dt.getTime() >= fromDate;
            })
          : allRighe;

        allRighe = toDate
          ? allRighe.filter(doc => {
              const dt = new Date(doc.FATTURA.DATA_FATTURA);
              return dt.getTime() <= toDate;
            })
          : allRighe;

        allRighe = !medico
          ? allRighe
          : allRighe.filter(doc => doc.MED_ID === medico);

        allRighe =
          branche.length === 0
            ? allRighe
            : allRighe.filter(doc => branche.includes(doc.BRANCA));
        //permanenti 1x-4x
        //decidui 5x-8x\
        allRighe = !denti
          ? allRighe
          : allRighe.filter(doc => {
              let isDecidui = false;
              doc.DENTI.split(",").forEach(elm => {
                if (denti === 2 && parseInt(elm) <= 50) {
                  isDecidui = true;
                }
                if (denti === 1 && parseInt(elm) >= 50) {
                  isDecidui = true;
                }
              });
              return isDecidui;
            });

        allRighe.forEach(doc => {
          totalAmount += doc.PREZZO;
          //totalTaxes += doc.FATTURA.IMPOSTA;
          //totalStamps += doc.FATTURA.BOLLI;
          //totalServices += doc.FATTURA.PRESTAZIONI;
        });
        totalCount = allRighe.length;

        const righe = paginateResults({
          after,
          pageSize,
          results: allRighe
        });
        return {
          righe,
          cursor: righe.length ? righe[righe.length - 1]._id : null,
          hasMore: righe.length
            ? righe[righe.length - 1]._id !== allRighe[allRighe.length - 1]._id
            : false,
          meta: {
            totalCount,
            totalAmount,
            totalTaxes,
            totalStamps,
            totalServices
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

        const pathNameFile = path.join(
          process.env.APP_PATH,
          "exports",
          nameFile
        );

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

          const dir = `${process.env.APP_PATH}/exports`;

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
                  Codice: calculatedCode,
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
    MEDICO: ({ MED_ID }, _, { dataSources }) => {
      return dataSources.databaseAPI.getAllMedici().then(results => {
        return results.filter(elm => elm.MED_ID === MED_ID)[0];
      });
    },
    BRANCA: ({ BRANCA }, _, { dataSources }) => {
      return dataSources.databaseAPI.getAllBranche().then(results => {
        return results.filter(elm => elm.BRANCA === BRANCA)[0];
      });
    },
    FATTURA: ({ _refFattura }, _, { dataSources }) => {
      return dataSources.databaseAPI.getAllFatture().then(results => {
        return results.filter(elm => elm._id === _refFattura)[0];
      });
    }
  }
};
