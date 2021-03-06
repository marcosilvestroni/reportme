import React from "react";
import { Segment, Button } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const downloadExport = () => {
  window.ipcRenderer.send("download-export");
};

const QUERY_EXPORT = gql`
  query export($fromDate: Float, $toDate: Float) {
    export(fromDate: $fromDate, toDate: $toDate)
  }
`;

export default ({ filters }) => {
  const { data, loading, error } = useQuery(QUERY_EXPORT, {
    variables: filters,
    fetchPolicy: "network-only"
  });
  if (error) return <p>ERROR : {error.message}</p>;

  if (loading) return <p>LOADING</p>;

  return (
    <Segment>
      {data && <Button onClick={downloadExport}>Visualizza Export</Button>}
    </Segment>
  );
};
