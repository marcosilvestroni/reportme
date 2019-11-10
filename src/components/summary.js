import React, { useState } from "react";
import { Header, Divider, Table, Container, Form } from "semantic-ui-react";
import { parseCurrency } from "./utils";

export default ({ meta }) => {
  const [total, setTotal] = useState();

  const handleChange = (e, { value }) => {
    setTotal((meta.totalAmount * value) / 100);
  };

  return (
    <div className="printme">
      <Header tag="h2">Riepilogo</Header>
      <Divider />
      <Container>
        <Table basic="very" celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Header as="h4">{"Numero Documenti"}</Header>
              </Table.Cell>
              <Table.Cell textAlign="right">
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
                <Header as="h3">{"Totale"}</Header>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Header as="h3">{parseCurrency(meta.totalAmount)}</Header>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Header as="h4">{"Applica percentuale"}</Header>
              </Table.Cell>
              <Table.Cell textAlign="right">

                <Form.Input
                  type="text"
                  name="perc"
                  onChange={handleChange}
                  labelPosition="left"
                  label="%"
                ></Form.Input>
              </Table.Cell>
            </Table.Row>
            {total && (
              <Table.Row>
                <Table.Cell >
                  <Header as="h4">{"Importo dovuto al professionista"}</Header>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Header as="h3">{parseCurrency(total)}</Header>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Container>
    </div>
  );
};
