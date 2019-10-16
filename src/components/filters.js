import React, { useState } from "react";
//import PropTypes from "prop-types";
import { Form, Header, Segment, Divider } from "semantic-ui-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const FILTERS_DATA = gql`
  query filters {
    medici {
      MED_ID
      COGNOME
      NOME
      TITOLO
    }
    pagamenti {
      CDA_CONTO
      DES_CONTO
    }
  }
`;

const Filters = ({ update }) => {
  const [filters, setFilters] = useState({});
  const { data, loading, error } = useQuery(FILTERS_DATA);

  if (error) return <p>ERROR : {error.message}</p>;

  const applyFilters = () => {
    console.log(filters)
    update(filters);
  };
  const resetFilters = () => {
    setFilters({})
    update({});
  };

  const handleChange = (e, { name, value }) => {
    let updateVal = value
    if (['fromDate', 'toDate'].includes(name)) {
      const dateVal = new Date(value)
      updateVal = dateVal.getTime()
    }
    setFilters({ ...filters, [name]: updateVal });
  };

  return (
    <Segment loading={loading}>
      <Header tag="h3">Filtri</Header>
      <Form id="filters" loading={loading}>
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
        <Form.Group widths={2}>
          {data && (
            <Form.Select
              label="Medico"
              name="medico"
              options={
                data.medici &&
                data.medici.map(({ MED_ID, TITOLO, COGNOME, NOME }) => ({
                  key: MED_ID,
                  value: MED_ID,
                  text: `${TITOLO} ${COGNOME} ${NOME}`
                }))
              }
              onChange={handleChange}
            ></Form.Select>
          )}
          <Form.Select
            label="Tipo"
            name="tipo"
            options={[
              { value: "FATIMM", text: "Fattura Immediata" },
              { value: "ACCONT", text: "Fattura Acconto" }
            ]}
            onChange={handleChange}
          ></Form.Select>
        </Form.Group>
        <Form.Group widths={2}>
          {data && (
            <Form.Select
              label="Pagamento"
              name="pagamento"
              options={
                data.pagamenti &&
                data.pagamenti.map(({ CDA_CONTO, DES_CONTO }) => ({
                  key: CDA_CONTO,
                  value: CDA_CONTO,
                  text: `${DES_CONTO}`
                }))
              }
              onChange={handleChange}
            ></Form.Select>
          )}
          <Form.Group widths={2}>
          <Divider />
            <Form.Button onClick={applyFilters}>Applica filtri</Form.Button>
            <Form.Button onClick={resetFilters}>Reset filtri</Form.Button>
          </Form.Group>
        </Form.Group>
      </Form>
    </Segment>
  );
};

Filters.propTypes = {};

export default Filters;
