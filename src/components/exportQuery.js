import React from "react";
import { Segment, Button } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
//const { BrowserWindow } = require("electron");

//let win = new BrowserWindow({ width: 800, height: 600 });

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

  //if (data) win.webContents.downloadURL(`file://${data.export}`);
  return <Segment>{data && <Button icon="file excel">{data.export}</Button>}</Segment>;
};
