import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Header } from "semantic-ui-react";
import { getMedici } from "../api";

const Filters = props => {
  const initialState = {
    doctors: []
  };
  const [filterOptions, setFiltersOptions] = useState(initialState);

  getMedici().then(res => {
    if (Array.isArray(res.recordset) && res.recordset.length > 0) {
      setFiltersOptions({
        doctors: res.recordset.map(elm => ({
          text: `${elm.COGNOME} ${elm.NOME} (cod. ${elm.MED_ID}) `,
          value: `${elm.MED_ID}`
        }))
      });
    }
  });

  return (
    <div>
      <Header tag="h3">Filtri</Header>
      <Form>
        <Form.Group widths={2}>
          <Form.Input label="Da data" type="date" name="fromDate"></Form.Input>
          <Form.Input label="A data" type="date" name="toDate"></Form.Input>
          <Form.Select
            label="Medico"
            name="doctor"
            options={filterOptions.doctors}
          ></Form.Select>
        </Form.Group>
      </Form>
    </div>
  );
};

Filters.propTypes = {};

export default Filters;
