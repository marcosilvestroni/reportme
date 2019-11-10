import React from "react";
import { Segment, Button } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const QUERY_EXPORT = gql`
  query export($fromDate: Float, $toDate: Float) {
    export(fromDate: $fromDate, toDate: $toDate)
  }
`;

export default ({ filters }) => {
  const { data, loading, error } = useQuery(QUERY_EXPORT, {
    variables: filters
  });
  if (error) return <p>ERROR : {error.message}</p>;

  if (loading) return <p>LOADING</p>;

  return (
    <Segment>
      {data && (
        <a href={`file://${data.export}`}>
          <Button icon="file excel"></Button>
        </a>
      )}
    </Segment>
  );
};
