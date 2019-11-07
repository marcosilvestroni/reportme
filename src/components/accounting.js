import React from "react";
import PropTypes from "prop-types";
import { Table, Divider, Header } from "semantic-ui-react";
import { parseCurrency, toDate } from "./utils";

function Acconting({ data }) {
  const headers = [
    "Num. fattura",
    "Data Fattura",
    "Paziente",
    "Medico",
    "Branca",
    "Descrizione",
    "Importo",
    "Pagamento"
  ];

  return (
    <div>
      <Header tag="h2">Documenti</Header>
      <Divider />
      <Table celled color="blue" className="printme">
        <Table.Header>
          <Table.Row>
            {headers.map((header, index) => (
              <Table.HeaderCell key={index}>{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{row.FATTURA.NUM_FATTURA}</Table.Cell>
                <Table.Cell>{toDate(row.FATTURA.DATA_FATTURA)}</Table.Cell>
                <Table.Cell>
                  {row.FATTURA.COGNOME} {row.FATTURA.NOME}
                </Table.Cell>
                <Table.Cell>
                  {row.MEDICO && `${row.MEDICO.COGNOME} ${row.MEDICO.NOME}`}
                </Table.Cell>
                <Table.Cell>{row.BRANCA.DES_BRANCA}</Table.Cell>
                <Table.Cell>{row.DESCRIZIONE_RIGA}</Table.Cell>
                <Table.Cell>{parseCurrency(row.PREZZO)}</Table.Cell>
                <Table.Cell>{row.FATTURA.PAG_DESC}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

Acconting.propTypes = {
  data: PropTypes.array
};

export default Acconting;
