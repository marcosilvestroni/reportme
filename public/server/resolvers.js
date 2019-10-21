const { paginateResults } = require("./utils");

module.exports = {
  Query: {
    medici: (_, __, { dataSources }) => dataSources.databaseAPI.getAllMedici(),
    fattura: (_, { numero, date }, { dataSources }) => {
      return dataSources.databaseAPI.getAllFatture().then(results => {
        return results.filter(doc => doc.NUM_FATTURA === numero);
      });
    },
    fatture: (
      _,
      { pageSize = 20, after, medico, pagamento, tipo, fromDate, toDate },
      { dataSources }
    ) => {
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

        allFatture = medico
          ? allFatture.filter(doc => doc.MED_ID === medico)
          : allFatture;
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
      dataSources.databaseAPI.getAllTipoDocumenti()
  }
};
