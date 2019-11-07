const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fastcsv = require("fast-csv");

app.use(cors());

app.get("/export", function(req, res) {
  fastcsv
    .writeToPath(
      "tmp.csv",
      { a: "1", b: "2" },
      {
        headers: true
      }
    )
    .on("error", err => console.error(err))
    .on("finish", () => console.log("Done writing."));

  res.send("export complete");
});


module.exports = app