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
        BOLLI
      }
      cursor
      hasMore
      meta {
        totalCount
        totalAmount
      }
    }
    tipoDocumenti {
      CDA_MODULO
      DES_MODULO
    }
  }
`;

export default () => {
  const [filters, updateFilters] = useState({});
  const { data, loading, fetchMore } = useQuery(RIGHE_DATA, {
    variables: filters,
  });
  
  let groupedRows = [];
  let marks = 0;
  

  const groupRows = data => {
    const grouped = [];
    data.forEach(head => {
      if (
        grouped.findIndex(elm => {
          return (
            elm.NUM_FATTURA === head.NUM_FATTURA &&
            elm.DATA_FATTURA === head.DATA_FATTURA
          );
        }) === -1
      ) {
        let sumRows = 0;
        marks += parseInt(head.BOLLI)
        grouped.push({
          NUM_FATTURA: head.NUM_FATTURA,
          DATA_FATTURA: head.DATA_FATTURA,
          TIPO_FATTURA: head.TIPO_FATTURA,
          RIGHE: data.filter(row => {
            if (
              row.NUM_FATTURA === head.NUM_FATTURA &&
              row.DATA_FATTURA === head.DATA_FATTURA
            ) {
              sumRows += parseFloat(row.PREZZO);
              return true;
            }
            return false;
          }),
          TOTALE: sumRows,
          PAGAMENTO: head.PAG_DESC,
          BOLLI: head.BOLLI
        });
      }
    });
    return grouped;
  };
  if (data) {
    groupedRows = groupRows(data.righe.righe)
  }

  
  return (
    <Segment loading={loading}>
      <Grid divided columns="equal">
        <Grid.Column>
          <Filters update={updateFilters} filters={filters} />
        </Grid.Column>
        <Grid.Column>{data && <Summary meta={{totalAmount:parseFloat(data.righe.meta.totalAmount)+parseFloat(marks)}} />}</Grid.Column>
      </Grid>

      {data && <Accounting data={groupedRows} typesDoc={data.tipoDocumenti}/>}
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
