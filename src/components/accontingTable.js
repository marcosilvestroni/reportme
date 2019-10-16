import React from "react";
import PropTypes from "prop-types";
import { Table, Divider, Header } from "semantic-ui-react";

const toDate = (timeStamp) => {
  const d = new Date(parseInt(timeStamp))
  return d.toLocaleDateString()
}

function AccontingTable({ data }) {
  const headers = [
    "Num. fattura",
    "Data Fattura",
    "Tipo Fattura",
    "Cognome",
    "Nome",
    "Medico",
    "Totale",
    "Pagamento"
  ];

  return (
    <div>
      <Header tag="h2">Fatture</Header>
      <Divider />
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
              <Table.Cell>{row.NUM_FATTURA}</Table.Cell>
              <Table.Cell>{toDate(row.DATA_FATTURA)}</Table.Cell>
              <Table.Cell>{row.TIPO_FATTURA}</Table.Cell>
              <Table.Cell>{row.COGNOME}</Table.Cell>
              <Table.Cell>{row.NOME}</Table.Cell>
              <Table.Cell>{row.COGNOME_MEDICO} {row.NOME_MEDICO}</Table.Cell>
              <Table.Cell>{row.TOTALE}</Table.Cell>
              <Table.Cell>{row.PAG_DESC}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

AccontingTable.propTypes = {
  data: PropTypes.array,
  headers: PropTypes.array
};

export default AccontingTable;
