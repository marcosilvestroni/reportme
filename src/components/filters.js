import React, { useState } from "react";
//import PropTypes from "prop-types";
import { Form, Header, Divider, Button } from "semantic-ui-react";
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
    tipoDocumenti {
      CDA_MODULO
      DES_MODULO
    }
  }
`;

const Filters = ({ update }) => {
  const [filters, setFilters] = useState({});
  const { data, loading, error } = useQuery(FILTERS_DATA);

  if (error) return <p>ERROR : {error.message}</p>;

  if (loading) return <p>LOADING</p>;

  const applyFilters = () => {
    update(filters);
  };
  const resetFilters = () => {
    setFilters({});
    update({});
  };

  const handleChange = (e, { name, value }) => {
    let updateVal = value;
    if (["fromDate", "toDate"].includes(name)) {
      const dateVal = new Date(value);
      updateVal = dateVal.getTime();
    }
    setFilters({ ...filters, [name]: updateVal });
  };

  const parseForDateInput = val => {
    if (val) {
      const dt = new Date(val);
      return dt && dt.toISOString().split("T")[0];
    }
  };

  const applyPresetDates = preset => {
    const dt = new Date();
    const withPreset = {
      today: () => {
        setFilters({
          ...filters,
          fromDate: dt.getTime(),
          toDate: dt.getTime()
        });
      },
      lastMonth: () => {
        const from = new Date();
        from.setMonth(from.getMonth() - 1);
        setFilters({
          ...filters,
          fromDate: from.getTime(),
          toDate: dt.getTime()
        });
      },
      lastThreeMonths: () => {
        const from = new Date();
        from.setMonth(from.getMonth() - 3);
        setFilters({
          ...filters,
          fromDate: from.getTime(),
          toDate: dt.getTime()
        });
      }
    };

    withPreset[preset]();
  };

  return (
    <div  className="printme">
      <Header tag="h3">Selezione</Header>
      <Divider />
      <Form id="filters" loading={loading}>
        <Form.Group>
          <Button.Group widths="3" basic>
            <Button onClick={() => applyPresetDates("today")}>Oggi</Button>
            <Button onClick={() => applyPresetDates("lastMonth")}>
              Ultimo Mese
            </Button>
            <Button onClick={() => applyPresetDates("lastThreeMonths")}>
              Ultimo Trimetre
            </Button>
          </Button.Group>
        </Form.Group>

        <Form.Group widths={2}>
          <Form.Input
            label="Da data"
            type="date"
            name="fromDate"
            onChange={handleChange}
            defaultValue={parseForDateInput(filters.fromDate)}
          ></Form.Input>
          <Form.Input
            label="A data"
            type="date"
            name="toDate"
            onChange={handleChange}
            defaultValue={parseForDateInput(filters.toDate)}
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
              defaultValue={filters.medico}
              value={filters.medico ? filters.medico : ""}
              clearable
            ></Form.Select>
          )}
          <Form.Select
            label="Tipo"
            name="tipo"
            options={
              data.tipoDocumenti &&
              data.tipoDocumenti.map(({ CDA_MODULO, DES_MODULO }) => ({
                key: CDA_MODULO,
                value: CDA_MODULO,
                text: `${DES_MODULO}`
              }))
            }
            onChange={handleChange}
            defaultValue={filters.tipo}
            value={filters.tipo ? filters.tipo : ""}
            clearable
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
              defaultValue={filters.pagamento}
              value={filters.pagamento ? filters.pagamento : ""}
              clearable
            ></Form.Select>
          )}
        </Form.Group>
        <Form.Group>
          <Button.Group widths="2">
            <Button size="large" secondary onClick={resetFilters}>
              Reset filtri
            </Button>
            <Button size="large" primary onClick={applyFilters}>
              Applica filtri
            </Button>
          </Button.Group>
        </Form.Group>
      </Form>
    </div>
  );
};

Filters.propTypes = {};

export default Filters;
