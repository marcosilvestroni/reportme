import React from "react";
import { Header, Segment, Form, Button } from "semantic-ui-react";
import SelectData from "../components/selectData";

const filterAccounting = () => {};

const exportReport = () => {
  return (
    <Segment>
      <Header tag="h3">Seleziona il periodo</Header>
      <Form>
        <Form.Group widths={2}>
          <Form.Input label="Da data" type="date" name="fromDate"></Form.Input>
          <Form.Input label="A data" type="date" name="toDate"></Form.Input>
        </Form.Group>
        <Form.Group>
          <Button size="large" secondary onClick={() => {}}>
            Genera file di esportazione
          </Button>
        </Form.Group>
      </Form>
    </Segment>
  );
};

export default exportReport;
