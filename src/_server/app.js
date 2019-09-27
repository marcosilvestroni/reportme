const express = require('express')
const app = express()
const db = require('./database/config')
const cors = require('cors')

const connectAndQuery = (query, res) => {
  const { conn, reqSql } = db
  conn.connect(async err => {
    if (err) {
      console.log('error on connection', err)
      return
    }
    await reqSql.query(query, (err, recordset) => {
      if (err) {
        console.log('error in querying', err)
        return
      }
      conn.close()
      res.send(recordset)
    })
  })
}

app.use(cors())

app.get('/', function(req, res) {
  res.send('Server up and running.. Enjoy!!')
})

app.get('/fatture', function(req, res) {
  connectAndQuery(
    'SELECT     dbo.MGXX_DOCTST_MEDICI.MED_ID, dbo.MGXX_DOCTST_MEDICI.CDA_INTEST AS PZ_INT, dbo.PAZIENTI.COGNOME, dbo.PAZIENTI.NOME, \
    dbo.PAZIENTI.LOC, dbo.PAZIENTI.CAP, dbo.PAZIENTI.PROV, dbo.PAZIENTI.IND, dbo.PAZIENTI.CF, dbo.CAXX_DOCTST.NUM_FATTURA, \
    dbo.CAXX_DOCTST.DAT_STP_DEFINITIVA AS DATA_FATTURA, dbo.MGXX_DOCTST.CDA_MODULO, dbo.MEDICI.NOME AS NOME_MEDICO, \
    dbo.MEDICI.COGNOME AS COGNOME_MEDICO, dbo.CAXX_IMPORTIFAT.VAL_TOT_IMPONIBILE, dbo.CAXX_IMPORTIFAT.VAL_TOT_IMPOSTA, \
    dbo.CAXX_IMPORTIFAT.VAL_TOT_FATTURA, dbo.CAXX_IMPORTIFAT.VAL_VOCE_SPE_BOL, dbo.CAXX_IMPORTIFAT.VAL_IMP_NET_MERCE, \
    dbo.CAXX_ACCONTI_FATT.NUM_FATTURA AS RIF_NUM_FATTURA, dbo.CAXX_ACCONTI_FATT.DTM_FATTURA AS RIF_DATA_FATTURA \
  FROM         dbo.PAZIENTI INNER JOIN \
    dbo.CAXX_DOCTST INNER JOIN \
    dbo.MGXX_DOCTST ON dbo.CAXX_DOCTST.CDA_POLO_NUM = dbo.MGXX_DOCTST.CDA_POLO_NUM AND \
    dbo.CAXX_DOCTST.CDA_TIPO_DOC_NUM = dbo.MGXX_DOCTST.CDA_TIPO_DOC_NUM AND \
    dbo.CAXX_DOCTST.NUM_ESER_CONT = dbo.MGXX_DOCTST.NUM_ESER_CONT AND \
    dbo.CAXX_DOCTST.CDA_SERIE_NUM = dbo.MGXX_DOCTST.CDA_SERIE_NUM AND \
    dbo.CAXX_DOCTST.PRG_DOC = dbo.MGXX_DOCTST.PRG_DOC INNER JOIN\
    dbo.MGXX_DOCTST_MEDICI ON dbo.MGXX_DOCTST.CDA_POLO_NUM = dbo.MGXX_DOCTST_MEDICI.CDA_POLO_NUM AND \
    dbo.MGXX_DOCTST.CDA_TIPO_DOC_NUM = dbo.MGXX_DOCTST_MEDICI.CDA_TIPO_DOC_NUM AND \
    dbo.MGXX_DOCTST.NUM_ESER_CONT = dbo.MGXX_DOCTST_MEDICI.NUM_ESER_CONT AND \
    dbo.MGXX_DOCTST.CDA_SERIE_NUM = dbo.MGXX_DOCTST_MEDICI.CDA_SERIE_NUM AND \
    dbo.MGXX_DOCTST.PRG_DOC = dbo.MGXX_DOCTST_MEDICI.PRG_DOC ON \
    dbo.PAZIENTI.PZ_ID = dbo.MGXX_DOCTST_MEDICI.CDA_INTEST INNER JOIN\
    dbo.CAXX_IMPORTIFAT ON dbo.MGXX_DOCTST.CDA_POLO_NUM = dbo.CAXX_IMPORTIFAT.CDA_POLO_NUM AND \
    dbo.MGXX_DOCTST.CDA_TIPO_DOC_NUM = dbo.CAXX_IMPORTIFAT.CDA_TIPO_DOC_NUM AND \
    dbo.MGXX_DOCTST.NUM_ESER_CONT = dbo.CAXX_IMPORTIFAT.NUM_ESER_CONT AND \
    dbo.MGXX_DOCTST.CDA_SERIE_NUM = dbo.CAXX_IMPORTIFAT.CDA_SERIE_NUM AND \
    dbo.MGXX_DOCTST.PRG_DOC = dbo.CAXX_IMPORTIFAT.PRG_DOC INNER JOIN\
    dbo.MEDICI ON dbo.MGXX_DOCTST_MEDICI.MED_ID = dbo.MEDICI.MED_ID INNER JOIN \
    dbo.CAXX_ACCONTI_FATT ON dbo.MGXX_DOCTST.CDA_POLO_NUM = dbo.CAXX_ACCONTI_FATT.CDA_POLO_NUM AND \
    dbo.MGXX_DOCTST.CDA_TIPO_DOC_NUM = dbo.CAXX_ACCONTI_FATT.CDA_TIPO_DOC_NUM AND \
    dbo.MGXX_DOCTST.NUM_ESER_CONT = dbo.CAXX_ACCONTI_FATT.NUM_ESER_CONT AND \
    dbo.MGXX_DOCTST.CDA_SERIE_NUM = dbo.CAXX_ACCONTI_FATT.CDA_SERIE_NUM AND  \
    dbo.MGXX_DOCTST.PRG_DOC = dbo.CAXX_ACCONTI_FATT.PRG_DOC',
    res
  )
})

app.get('/medici', function(req, res) {
  connectAndQuery('select * from medici', res)
})

app.listen(3001, function() {
  console.log('Server listining on 3001..')
})
