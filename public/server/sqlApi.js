const { SQLDataSource } = require("datasource-sql");

const TIMING = 0;

class sqlApi extends SQLDataSource {
  getMedici(id) {
    return this.knex
      .select("MED_ID", "COGNOME", "NOME", "TITOLO")
      .from("medici")
      .whereNot({ TITOLO: "N.A." })
      .where(function() {
        if (id) {
          this.where("MED_ID", "=", id);
        }
      })
      .cache(TIMING);
  }

  getPagamenti() {
    return this.knex
      .select("CDA_CONTO", "DES_CONTO")
      .from("cgxx_conti_pag_v1")
      .cache(TIMING);
  }

  getBranche(id) {
    return this.knex
      .select("BRANCA", "DES_BRANCA")
      .from("_branca")
      .where(function() {
        if (id) {
          this.where("BRANCA", "=", id);
        }
      })
      .cache(TIMING);
  }

  getPazienti(id) {
    return this.knex
      .select("PZ_ID", "NOME", "COGNOME")
      .from("pazienti")
      .where(function() {
        if (id) {
          this.where("PZ_ID", "=", id);
        }
      })
      .cache(TIMING);
  }

  getTipoDocumenti() {
    return this.knex
      .select("CDA_MODULO", "DES_MODULO")
      .from("caxx_tipo_documento")
      .cache(TIMING);
  }

  getRighe(medico, pagamento, tipo, fromDate, toDate, branche = [], denti) {
    return this.knex
      .select(
        {
          ID: this.knex.raw(
            "MGXX_DOCTST.CDA_POLO_NUM+MGXX_DOCTST.CDA_TIPO_DOC_NUM+cast(MGXX_DOCTST.NUM_ESER_CONT as varchar)+MGXX_DOCTST.CDA_SERIE_NUM+cast(MGXX_DOCTST.PRG_DOC as varchar)+cast(MGXX_DOCRIG.PRG_RIGA_DOC as varchar)"
          )
        },
        "schede_righe.PZ_ID",
        { CODICE_LISTINO: "schede_righe.DESCR_B" },
        "schede_righe.MED_ID",
        "schede_righe.BRANCA",
        { PREZZO: "MGXX_DOCRIG.VAL_PRZ_MOVIMENTO" },
        { DENTI: "schede_righe.DENTI_VIS" },
        "MGXX_DOCRIG.DES_RIGA_DOC",
        "MGXX_DOCRIG.DEV_RIGA_DOC",
        { DATA_FATTURA: "CAXX_DOCTST.DAT_STP_DEFINITIVA" },
        "CAXX_DOCTST.NUM_FATTURA",
        { NUMERO_RIGA: "MGXX_DOCRIG.PRG_RIGA_DOC" },
        { PAG_DESC: "CGXX_CONTI.DES_CONTO" },
        { PAG_COD: "CGXX_CONTI.CDA_CONTO" },
        { TIPO_FATTURA: "MGXX_DOCTST.CDA_MODULO" },
        { MEDICO_FATTURA: "MGXX_DOCTST_MEDICI.MED_ID" },
        { PZ_FATTURA: "MGXX_DOCTST_MEDICI.CDA_INTEST" }
      )
      .column()
      .from("SCHEDE_RIGHE_FATT")
      .rightOuterJoin("MGXX_DOCRIG", function() {
        this.on(
          "SCHEDE_RIGHE_FATT.CDA_POLO_NUM",
          "=",
          "MGXX_DOCRIG.CDA_POLO_NUM"
        )
          .andOn(
            "SCHEDE_RIGHE_FATT.NUM_ESER_CONT",
            "=",
            "MGXX_DOCRIG.NUM_ESER_CONT"
          )
          .andOn(
            "SCHEDE_RIGHE_FATT.CDA_SERIE_NUM",
            "=",
            "MGXX_DOCRIG.CDA_SERIE_NUM"
          )
          .andOn("SCHEDE_RIGHE_FATT.PRG_DOC", "=", "MGXX_DOCRIG.PRG_DOC")
          .andOn(
            "SCHEDE_RIGHE_FATT.PRG_RIGA_DOC",
            "=",
            "MGXX_DOCRIG.PRG_RIGA_DOC"
          )
          .andOn(
            "SCHEDE_RIGHE_FATT.CDA_TIPO_DOC_NUM",
            "=",
            "MGXX_DOCRIG.CDA_TIPO_DOC_NUM"
          );
      })
      .leftOuterJoin("schede_righe", function() {
        this.on("SCHEDE_RIGHE_FATT.PZ_ID", "=", "schede_righe.PZ_ID")
          .andOn("SCHEDE_RIGHE_FATT.TIPOSCHEDA", "=", "schede_righe.TIPOSCHEDA")
          .andOn(
            "SCHEDE_RIGHE_FATT.NUMEROSCHEDA",
            "=",
            "schede_righe.NUMEROSCHEDA"
          )
          .andOn("SCHEDE_RIGHE_FATT.NO_RIGA", "=", "schede_righe.NO_RIGA");
      })
      .innerJoin("MGXX_DOCTST", function() {
        this.on("MGXX_DOCRIG.CDA_POLO_NUM", "=", "MGXX_DOCTST.CDA_POLO_NUM")
          .andOn(
            "MGXX_DOCRIG.CDA_TIPO_DOC_NUM",
            "=",
            "MGXX_DOCTST.CDA_TIPO_DOC_NUM"
          )
          .andOn("MGXX_DOCRIG.NUM_ESER_CONT", "=", "MGXX_DOCTST.NUM_ESER_CONT")
          .andOn("MGXX_DOCRIG.CDA_SERIE_NUM", "=", "MGXX_DOCTST.CDA_SERIE_NUM")
          .andOn("MGXX_DOCRIG.PRG_DOC", "=", "MGXX_DOCTST.PRG_DOC");
      })
      .innerJoin("MGXX_DOCTST_MEDICI", function() {
        this.on(
          "MGXX_DOCTST.CDA_POLO_NUM",
          "=",
          "MGXX_DOCTST_MEDICI.CDA_POLO_NUM"
        )
          .andOn(
            "MGXX_DOCTST.CDA_TIPO_DOC_NUM",
            "=",
            "MGXX_DOCTST_MEDICI.CDA_TIPO_DOC_NUM"
          )
          .andOn(
            "MGXX_DOCTST.NUM_ESER_CONT",
            "=",
            "MGXX_DOCTST_MEDICI.NUM_ESER_CONT"
          )
          .andOn(
            "MGXX_DOCTST.CDA_SERIE_NUM",
            "=",
            "MGXX_DOCTST_MEDICI.CDA_SERIE_NUM"
          )
          .andOn("MGXX_DOCTST.PRG_DOC", "=", "MGXX_DOCTST_MEDICI.PRG_DOC");
      })
      .innerJoin("CAXX_DOCTST", function() {
        this.on("MGXX_DOCTST.CDA_POLO_NUM", "=", "CAXX_DOCTST.CDA_POLO_NUM")
          .andOn(
            "MGXX_DOCTST.CDA_TIPO_DOC_NUM",
            "=",
            "CAXX_DOCTST.CDA_TIPO_DOC_NUM"
          )
          .andOn("MGXX_DOCTST.NUM_ESER_CONT", "=", "CAXX_DOCTST.NUM_ESER_CONT")
          .andOn("MGXX_DOCTST.CDA_SERIE_NUM", "=", "CAXX_DOCTST.CDA_SERIE_NUM")
          .andOn("MGXX_DOCTST.PRG_DOC", "=", "CAXX_DOCTST.PRG_DOC");
      })
      .innerJoin("CGXX_PNTESTATE", function() {
        this.on(
          "CAXX_DOCTST.DAT_STP_DEFINITIVA",
          "=",
          "CGXX_PNTESTATE.DAT_DOC"
        ).andOn("CAXX_DOCTST.NUM_FATTURA", "=", "CGXX_PNTESTATE.NUM_DOC");
      })
      .innerJoin("CGXX_PARTITE", function() {
        this.on(
          "CGXX_PNTESTATE.DAT_REGNE",
          "=",
          "CGXX_PARTITE.DAT_REGNE_PRN"
        ).andOn("CGXX_PNTESTATE.PRG_REGNE", "=", "CGXX_PARTITE.PRG_REGNE_PRN");
      })
      .innerJoin("CGXX_PAGAMENTI", function() {
        this.on(
          "CGXX_PARTITE.PRG_PARTITA",
          "=",
          "CGXX_PAGAMENTI.PRG_PARTITA"
        ).andOn("CGXX_PARTITE.CDA_CLIFOR", "=", "CGXX_PAGAMENTI.CDA_CLIFOR");
      })
      .innerJoin(
        "CGXX_CONTI",
        "CGXX_PAGAMENTI.CDA_CONTO_PAG",
        "CGXX_CONTI.CDA_CONTO"
      )
      .where(function() {
        if (medico) this.where("schede_righe.MED_ID", "=", medico);
      })
      .andWhere(function() {
        if (pagamento) this.where("CGXX_CONTI.CDA_CONTO", "=", pagamento);
      })
      .andWhere(function() {
        if (tipo) this.where("MGXX_DOCTST.CDA_MODULO", "=", tipo);
      })
      .andWhere(function() {
        if (branche.length > 0) this.whereIn("schede_righe.BRANCA", branche);
      })
      .andWhere(function() {
        if (fromDate && toDate) {
          const fd = new Date(fromDate);
          const td = new Date(toDate);

          this.where("CAXX_DOCTST.DAT_STP_DEFINITIVA", ">=", fd).andWhere(
            "CAXX_DOCTST.DAT_STP_DEFINITIVA",
            "<=",
            td
          );
        }
      })
      .andWhere(function() {
        if (denti) {
          if (denti === 1) {
            this.andWhere("DENTI_VIS", "like", "1%").orWhere(
              "DENTI_VIS",
              "like",
              ",1%"
            );
            this.andWhere("DENTI_VIS", "like", "2%").orWhere(
              "DENTI_VIS",
              "like",
              ",2%"
            );
            this.andWhere("DENTI_VIS", "like", "3%").orWhere(
              "DENTI_VIS",
              "like",
              ",3%"
            );
            this.andWhere("DENTI_VIS", "like", "4%").orWhere(
              "DENTI_VIS",
              "like",
              ",4%"
            );
          } else {
            this.andWhere("DENTI_VIS", "like", "5%").orWhere(
              "DENTI_VIS",
              "like",
              ",5%"
            );
            this.andWhere("DENTI_VIS", "like", "6%").orWhere(
              "DENTI_VIS",
              "like",
              ",6%"
            );
            this.andWhere("DENTI_VIS", "like", "7%").orWhere(
              "DENTI_VIS",
              "like",
              ",7%"
            );
            this.andWhere("DENTI_VIS", "like", "8%").orWhere(
              "DENTI_VIS",
              "like",
              ",8%"
            );
          }
        }
      })

      .orderBy([
        { column: "CAXX_DOCTST.DAT_STP_DEFINITIVA", order: "desc" },
        { column: "CAXX_DOCTST.NUM_FATTURA", order: "desc" }
      ]);
  }
}

module.exports = sqlApi;
