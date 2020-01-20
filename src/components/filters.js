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
    branche {
      BRANCA
      DES_BRANCA
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
    /* if (["fromDate", "toDate"].includes(name)) {
      const dateVal = new Date(value);
      updateVal = dateVal.getTime();
    } */
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
        const from = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 2);
        setFilters({
          ...filters,
          fromDate: from.getTime(),
          toDate: dt.getTime()
        });
      },
      thisMonth: () => {
        const from = new Date();
        from.setDate(1);
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

  const applyPresetBranche = preset => {
    const withPreset = {
      poliambulatorio: () => {
        setFilters({
          ...filters,
          branche: [
            "14",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29"
          ]
        });
      },
      odontoiatria: () => {
        setFilters({
          ...filters,
          branche: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "15",
            "16"
          ]
        });
      }
    };

    withPreset[preset]();
  };

  return (
    <div className="printme">
      <Header tag="h3">Selezione</Header>
      <Divider />
      <Form id="filters" loading={loading}>
        <Form.Group>
          <Button.Group widths="3" basic>
            <Button onClick={() => applyPresetDates("today")}>Oggi</Button>
            <Button onClick={() => applyPresetDates("thisMonth")}>
              Questo Mese
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
              value={filters.pagamento || ""}
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
            value={filters.tipo || ""}
            clearable
          ></Form.Select>
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
              value={filters.medico || ""}
              clearable
            ></Form.Select>
          )}
          <Form.Group>
            <Form.Checkbox
              name="denti"
              label="Solo prestazioni su permanenti"
              onChange={handleChange}
              value={1}
              checked={filters.denti === 1}
            ></Form.Checkbox>
            <Form.Checkbox
              name="denti"
              label="Solo prestazioni su decidui"
              onChange={handleChange}
              value={2}
              checked={filters.denti === 2}
            ></Form.Checkbox>
          </Form.Group>
        </Form.Group>
        <Form.Group widths="equal">
          {data && (
            <Form.Select
              label="Branca"
              name="branche"
              options={
                data.branche &&
                data.branche.map(({ BRANCA, DES_BRANCA }) => ({
                  key: BRANCA,
                  value: BRANCA,
                  text: `${DES_BRANCA}`
                }))
              }
              onChange={handleChange}
              value={filters.branche || []}
              clearable
              fluid
              multiple
              selection
            ></Form.Select>
          )}
        </Form.Group>
        <Form.Group>
          <Button.Group widths="2" basic>
            <Button onClick={() => applyPresetBranche("odontoiatria")}>
              Odontoiatria
            </Button>
            <Button onClick={() => applyPresetBranche("poliambulatorio")}>
              Poliambulatorio
            </Button>
          </Button.Group>
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
