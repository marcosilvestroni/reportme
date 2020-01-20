import React from "react";
import PropTypes from "prop-types";
import { Table, Divider, Header } from "semantic-ui-react";
import { parseCurrency, toDate } from "./utils";

function Acconting({ data }) {
  const headers = [
    "Num. Documento",
    "Data Documento",
    "Tipo Documento",
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
                <Table.Cell>{row.NUM_FATTURA}</Table.Cell>
                <Table.Cell>{toDate(row.DATA_FATTURA)}</Table.Cell>
                <Table.Cell>{row.TIPO_FATTURA}</Table.Cell>
                <Table.Cell>
                  {row.PAZIENTE.COGNOME} {row.PAZIENTE.NOME}
                </Table.Cell>
                <Table.Cell>
                  {row.MEDICO && `${row.MEDICO.COGNOME} ${row.MEDICO.NOME}`}
                </Table.Cell>
                <Table.Cell>{row.BRANCA ? row.BRANCA.DES_BRANCA: ''}</Table.Cell>
                <Table.Cell>{row.DES_RIGA_DOC} {row.DEV_RIGA_DOC}</Table.Cell>
                <Table.Cell>{parseCurrency(row.PREZZO)}</Table.Cell>
                <Table.Cell>{row.PAG_DESC}</Table.Cell>
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
