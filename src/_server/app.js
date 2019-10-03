const express = require("express");
const app = express();
const db = require("./database/config");
const cors = require("cors");
const queries = require("./database/queries");
const { conn, reqSql } = db;
const path = require("path");
const fastcsv = require("fast-csv");

const connectAndQuery = (query, res) => {
  conn.connect(async err => {
    if (err) {
      console.log("error on connection", err);
      return;
    }
    await reqSql.query(query, (err, recordset) => {
      if (err) {
        console.log("error in querying", err);
        return;
      }
      conn.close();
      res.send(recordset);
    });
  });
};

app.use(cors());

app.get("/", function(req, res) {
  res.send("Server up and running.. Enjoy!!");
});

app.get("/fatture", function(req, res) {
  connectAndQuery(queries.fatture, res);
});

app.get("/medici", function(req, res) {
  connectAndQuery(queries.medici, res);
});

app.get("/export", function(req, res) {
  conn.connect(async err => {
    if (err) {
      console.log("error on connection", err);
      return;
    }
    await reqSql.query(queries.fatture, (err, recordset) => {
      if (err) {
        console.log("error in querying", err);
        return;
      }
      conn.close();
      fastcsv
        .writeToPath("tmp.csv", recordset.recordset, {
          headers: true
        })
        .on("error", err => console.error(err))
        .on("finish", () => console.log("Done writing."));

      res.send("export complete");
    });
  });
});

app.listen(3001, function() {
  console.log("Server listining on 3001..");
});
