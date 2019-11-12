import React, { useState } from "react";
import { Header, Segment, Form } from "semantic-ui-react";
import ExportQuery from "../components/exportQuery";

export default () => {
  const [filters, updateFilters] = useState();

  const handleChange = (e, { name, value }) => {
    let updateVal = value;
    if (["fromDate", "toDate"].includes(name)) {
      const dateVal = new Date(value);
      updateVal = dateVal.getTime();
    }
    updateFilters({
      ...filters,
      [name]: updateVal
    });
  };

  return (
    <Segment>
      <Header tag="h3">Seleziona il periodo</Header>
      <Form>
        <Form.Group widths={2}>
          <Form.Input
            label="Da data"
            type="date"
            name="fromDate"
            onChange={handleChange}
          ></Form.Input>
          <Form.Input
            label="A data"
            type="date"
            name="toDate"
            onChange={handleChange}
          ></Form.Input>
        </Form.Group>
        
      </Form>
      {filters && filters.fromDate && filters.toDate && <ExportQuery filters={filters} />}
    </Segment>
  );
};
