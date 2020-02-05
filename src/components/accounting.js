import React from "react";
import PropTypes from "prop-types";
import { Table, Divider, Header, Segment } from "semantic-ui-react";
import { parseCurrency, toDate } from "./utils";

function Acconting({ data, typesDoc }) {
  const headers = [
    "N. riga",
    "Paziente",
    "Medico",
    "Branca",
    "Descrizione",
    "Prezzo"
  ];

  return (
    <Segment>
      <Header tag="h2">Documenti</Header>

      {data.map((head, index) => (
        <div key={index}>
          <Table color="blue" className="printme" inverted>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Numero {head.NUM_FATTURA}</Table.HeaderCell>
                <Table.HeaderCell>
                  Data {toDate(head.DATA_FATTURA)}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Tipo{" "}
                  {typesDoc
                    ? typesDoc.filter(
                        elm => elm.CDA_MODULO === head.TIPO_FATTURA
                      )[0].DES_MODULO
                    : ""}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Imponibile {parseCurrency(head.TOTALE)}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Bolli {parseCurrency(head.BOLLI)}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Totale {parseCurrency(parseFloat(head.TOTALE) + parseFloat(head.BOLLI))}
                </Table.HeaderCell>
                <Table.HeaderCell>Pagamento {head.PAGAMENTO}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>

          <Table celled color="blue" className="printme">
            <Table.Header>
              <Table.Row>
                {headers.map((header, index) => (
                  <Table.HeaderCell key={index}>{header}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {head.RIGHE.map((row, index) => {
                return (
                  <Table.Row
                    key={`${row.NUM_FATTURA}${row.DATA_FATTURA}${row.NUMERO_RIGA}`}
                  >
                    <Table.Cell>{row.NUMERO_RIGA}</Table.Cell>
                    <Table.Cell>
                      {row.PAZIENTE.COGNOME} {row.PAZIENTE.NOME}
                    </Table.Cell>
                    <Table.Cell>
                      {row.MEDICO && `${row.MEDICO.COGNOME} ${row.MEDICO.NOME}`}
                    </Table.Cell>
                    <Table.Cell>
                      {row.BRANCA ? row.BRANCA.DES_BRANCA : ""}
                    </Table.Cell>
                    <Table.Cell>
                      {row.DES_RIGA_DOC} {row.DEV_RIGA_DOC}
                    </Table.Cell>
                    <Table.Cell>{parseCurrency(row.PREZZO)}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Divider />
        </div>
      ))}
    </Segment>
  );
}

Acconting.propTypes = {
  data: PropTypes.array
};

export default Acconting;
