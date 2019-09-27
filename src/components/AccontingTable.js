import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

function AccontingTable({ data }) {
  const headers = [
    'Cod. Paziente',
    'Cognome',
    'Nome',
    'Località',
    'Num. fattura',
    'Data Fattura',
    'Tipo Fattura',
    'Medico',
    'Imponibile',
    'Bolli',
    'Totale',
    'Fattura Rif. N.',
    'Fattura Rif. Data',
  ]

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {headers.map((header, index) => (
            <Table.HeaderCell key={index}>{header}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((row, index) => (
          <Table.Row key={index}>
            <Table.Cell>{row.PZ_INT}</Table.Cell>
            <Table.Cell>{row.COGNOME}</Table.Cell>
            <Table.Cell>{row.NOME}</Table.Cell>
            <Table.Cell>{row.LOC}</Table.Cell>
            <Table.Cell>{row.NUM_FATTURA}</Table.Cell>
            <Table.Cell>{row.DATA_FATTURA}</Table.Cell>
            <Table.Cell>{row.CDA_MODULO}</Table.Cell>
            <Table.Cell>{row.COGNOME_MEDICO}</Table.Cell>
            <Table.Cell>{row.VAL_TOT_IMPONIBILE}</Table.Cell>
            <Table.Cell>{row.VAL_VOCE_SPE_BOL}</Table.Cell>
            <Table.Cell>{row.VAL_TOT_FATTURA}</Table.Cell>
            <Table.Cell>{row.RIF_NUM_FATTURA}</Table.Cell>
            <Table.Cell>{row.RIF_DATA_FATTURA}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

AccontingTable.propTypes = {
  data: PropTypes.array,
  headers: PropTypes.array,
}

export default AccontingTable
