import React from "react";
import { Header } from "semantic-ui-react";
import SelectData from "../components/selectData";
import { getFatture } from "../api";
import path from "path";
import fastcsv from "fast-csv";
import fs from "fs";

const filterAccounting = () => {
  getFatture().then(res => {
    console.log("fatture");
    const data = res.recordset;
    const csvStream = fastcsv.format({ headers: true });
    //csvStream.pipe(process.stdout);
    csvStream.write(data);
    csvStream.on("end", () => console.log("ended"));
    fs.write(path.join(__dirname, "out.txt", "mytest"));
  });
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
