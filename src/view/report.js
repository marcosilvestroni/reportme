import React, { useState } from "react";
import AccontingTable from "../components/accontingTable";
import { Segment, Button, Grid } from "semantic-ui-react";
//import PropTypes from "prop-types";
import Filters from "../components/filters";
import Summary from "../components/summary";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export const FATTURE_DATA = gql`
  query fatture(
    $after: String
    $medico: String
    $pagamento: String
    $tipo: String
    $fromDate: Float
    $toDate: Float
  ) {
    fatture(
      after: $after
      medico: $medico
      pagamento: $pagamento
      tipo: $tipo
      fromDate: $fromDate
      toDate: $toDate
    ) {
      fatture {
        _id
        NUM_FATTURA
        DATA_FATTURA
        TIPO_FATTURA
        COGNOME
        NOME
        COGNOME_MEDICO
        NOME_MEDICO
        TOTALE
        PAG_DESC
      }
      cursor
      hasMore
      meta {
        totalCount
        totalAmount
        totalTaxes
        totalStamps
        totalServices
      }
    }
  }
`;

export default () => {
  const [filters, updateFilters] = useState({});
  const { data, loading, error, fetchMore } = useQuery(FATTURE_DATA, {
    variables: filters
  });

  if (error) return <p>ERROR : {error.message}</p>;

  return (
    <Segment loading={loading}>
      <Grid divided columns="equal">
        <Grid.Column>
          <Filters update={updateFilters} />
        </Grid.Column>
        <Grid.Column>
          {data && <Summary meta={data.fatture.meta} />}
        </Grid.Column>
      </Grid>

      {data && <AccontingTable data={data.fatture.fatture} />}
      {data && data.fatture && data.fatture.hasMore && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                after: data.fatture.cursor
              },

              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  fatture: {
                    ...fetchMoreResult.fatture,
                    fatture: [
                      ...prev.fatture.fatture,
                      ...fetchMoreResult.fatture.fatture
                    ]
                  }
                };
              }
            })
          }
        >
          Visualizza altri documenti
        </Button>
      )}
    </Segment>
  );
};
