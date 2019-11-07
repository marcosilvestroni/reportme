import React from "react";
import { Header, Divider, Table, Container } from "semantic-ui-react";
import { parseCurrency } from "./utils";

export default ({ meta }) => {
  return (
    <div  className="printme">
      <Header tag="h2">Riepilogo</Header>
      <Divider />
      <Container>
        <Table basic="very" celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Header as="h4">{"Numero Documenti"}</Header>
              </Table.Cell>
              <Table.Cell>
                <Header as="h4">{meta.totalCount}</Header>
              </Table.Cell>
            </Table.Row>
            {/* <Table.Row>
              <Table.Cell>
                <Header as="h4" image>
                  {"Prestazioni/imponibile"}
                </Header>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Header as="h4">{parseCurrency(meta.totalServices)}</Header>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Header as="h4" >
                  {"Iva"}
                </Header>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Header as="h4">{parseCurrency(meta.totalTaxes)}</Header>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Header as="h4">{"Bolli"}</Header>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Header as="h4">{parseCurrency(meta.totalStamps)}</Header>
              </Table.Cell>
            </Table.Row>*/}
            <Table.Row> 
              <Table.Cell>
                <Header as="h3" >
                  {"Totale"}
                </Header>
              </Table.Cell>
              <Table.Cell textAlign="right">
              <Header as="h3" >{parseCurrency(meta.totalAmount)}</Header>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Container>
    </div>
  );
};
