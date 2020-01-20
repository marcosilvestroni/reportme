import React, { useState } from "react";
import Accounting from "../components/accounting";
import { Segment, Button, Grid } from "semantic-ui-react";
import Filters from "../components/filters";
import Summary from "../components/summary";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
export const RIGHE_DATA = gql`
  query righe(
    $after: String
    $medico: String
    $pagamento: String
    $tipo: String
    $fromDate: Float
    $toDate: Float
    $branche: [String]
    $denti: Int
  ) {
    righe(
      after: $after
      medico: $medico
      pagamento: $pagamento
      tipo: $tipo
      fromDate: $fromDate
      toDate: $toDate
      branche: $branche
      denti: $denti
    ) {
      righe {
        NUMERO_RIGA
        PREZZO
        DENTI
        MEDICO {
          COGNOME
          NOME
        }
        BRANCA {
          DES_BRANCA
        }
        NUM_FATTURA
        DATA_FATTURA
        TIPO_FATTURA
        PAZIENTE {
          NOME
          COGNOME
        }
        PAG_DESC
        DES_RIGA_DOC
        DEV_RIGA_DOC
      }
      cursor
      hasMore
      meta {
        totalCount
        totalAmount
      }
    }
  }
`;

export default () => {
  const [filters, updateFilters] = useState({});
  const { data, loading, error, fetchMore } = useQuery(RIGHE_DATA, {
    variables: filters,
    skip: !filters
  });
  if (error) console.log(error.message);

  return (
    <Segment loading={loading}>
      <Grid divided columns="equal">
        <Grid.Column>
          <Filters update={updateFilters} />
        </Grid.Column>
        <Grid.Column>{data && <Summary meta={data.righe.meta} />}</Grid.Column>
      </Grid>

      {data && <Accounting data={data.righe.righe} />}
      {data && data.righe && data.righe.hasMore && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                after: data.righe.cursor
              },

              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  righe: {
                    ...fetchMoreResult.righe,
                    righe: [...prev.righe.righe, ...fetchMoreResult.righe.righe]
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
