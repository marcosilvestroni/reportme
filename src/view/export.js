import React from "react";
import { Header, Segment } from "semantic-ui-react";
import SelectData from "../components/selectData";

const filterAccounting = () => {};

const exportReport = () => {
  return (
    <Segment>
      <Header tag="h3">Seleziona il periodo</Header>
      <SelectData actionReport={filterAccounting} />
    </Segment>
  );
};

export default exportReport;
