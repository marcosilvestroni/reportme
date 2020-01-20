const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const databaseAPI = require("./database");
const { createStore } = require("./store");
let ipc = require("./server-ipc");
const Registry = require("winreg"),
  regKey = new Registry({
    hive: Registry.HKCU,
    key: "\\Software\\anthos\\Method\\4.0\\Generale"
  });

const express = require("express");
const cors = require("cors");
const path = require("path");
const ping = require("ping");
const fallback = "192.168.0.80"; //"192.168.0.80";



const sqlApi = require('./sqlApi')

let isDev, version;

if (process.argv[2] === "--subprocess") {
  isDev = false;
  version = process.argv[3];

  let socketName = process.argv[4];
  ipc.init(socketName);
} else {
  isDev = true;
}

const getServerName = () => {
  let reg = [];
  regKey.values((err, items) => {
    if (!err || (Array.isArray(items) && items.length > 0)) reg = items;
  });
  return (reg.filter(elm => elm.name == "DataSource")[0] || { value: "" })
    .value;
};

const name = getServerName();
ping.promise.probe(name, { timeout: 2 }).then(res => {
  const host = res.alive ? res.numeric_host : fallback;
  const store = createStore({
    user: "sa",
    password: "startup",
    server: host,
    database: "DB1_01",
    options: {
      instanceName: "MSSQLSERVER",
      tdsVersion: "7_1"
    }
  });
  const app = express();
  app.use(cors());
  app.get("/file-export", function(req, res) {
    res.sendFile(path.join(__dirname, "export.csv"));
  });


  const knexConfig = {
    debug: true,
    client: "mssql",
    connection: {
      user: "sa",
      password: "startup",
      server: host,
      database: "DB1_01",
      options: {
        instanceName: "MSSQLSERVER",
        tdsVersion: "7_1"
      }
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      databaseAPI: new databaseAPI({ store }),
      testAPI : new sqlApi(knexConfig) 
    }),
    engine: {
      apiKey: "service:reportMe:OrLQUEuzQG9r1Tb1ms0eTw",
    },
    tracing: true,
  });

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
