import React from "react";
import { Header } from "semantic-ui-react";
import SelectData from "../components/selectData";
import { getFatture } from "../api";
import path from "path";
import fastcsv from "fast-csv";
import fs from "fs";

const filterAccounting = () => {
  getFatture().then(res => {});
};

const exportReport = () => {
  return (
    <div>
      <Header tag="h3">Seleziona il periodo</Header>
      <SelectData actionReport={filterAccounting} />
    </div>
  );
};

export default exportReport;
