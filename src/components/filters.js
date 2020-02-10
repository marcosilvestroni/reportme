import React from "react";
import { Form, Header, Divider } from "semantic-ui-react";
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

const Filters = ({ update ,filters}) => {

  const { data, loading, error } = useQuery(FILTERS_DATA);

  if (error) return <p>ERROR : {error.message}</p>;

  if (loading) return <p>LOADING</p>;

  const handleChange = (e, { name, value }) => {
    let newFilters = {...filters};
    
    if ((Array.isArray(value) && !value.length) || !value) {
      delete newFilters[name];
    } else {
      let updateVal = value;
      if (["fromDate", "toDate"].includes(name)) {
        const dateVal = new Date(value);
        updateVal = dateVal.getTime();
      }
      newFilters = { ...newFilters, [name]: updateVal };
    }
    update({...newFilters});
  };

  const parseForDateInput = val => {
    if (val) {
      const dt = new Date(val);
      return dt && dt.toISOString().split("T")[0];
    }
  };

  /* const applyPresetBranche = preset => {
    const withPreset = {
      poliambulatorio: () => {
        update({
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
        update({
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
  }; */

  
  return (
    <div className="printme">
      <Header tag="h3">Selezione</Header>
      <Divider />
      <Form id="filters" loading={loading}>
        <Form.Group widths={2}>
          <Form.Input
            label="Da data"
            type="date"
            name="fromDate"
            onChange={handleChange}
            defaultValue={
              parseForDateInput(filters.fromDate)
            }
          ></Form.Input>
          <Form.Input
            label="A data"
            type="date"
            name="toDate"
            onChange={handleChange}
            defaultValue={
              parseForDateInput(filters.toDate) 
            }
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
              defaultValue={filters.pagamento}
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
            defaultValue={filters.tipo || ""}
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
              defaultValue={filters.medico || ""}
              clearable
            ></Form.Select>
          )}
          <Form.Select
            label="Permanenti/Decidui"
            name="denti"
            options={[
              {
                value: 1,
                text: "solo Permanenti"
              },
              {
                value: 2,
                text: "solo Decidui"
              }
            ]}
            onChange={handleChange}
            defaultValue={filters.denti || ""}
            clearable
          ></Form.Select>
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
        {/* <Form.Group>
          <Button.Group widths="2" basic>
            <Button onClick={() => applyPresetBranche("odontoiatria")}>
              Odontoiatria
            </Button>
            <Button onClick={() => applyPresetBranche("poliambulatorio")}>
              Poliambulatorio
            </Button>
          </Button.Group>
        </Form.Group> */}
     </Form>
    </div>
  );
};

Filters.propTypes = {};

export default Filters;
