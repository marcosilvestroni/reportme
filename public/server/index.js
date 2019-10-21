const { ApolloServer } = require("apollo-server");
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
const ping = require("ping");
const fallback = "192.168.1.133";

let isDev, version;

if (process.argv[2] === "--subprocess") {
  isDev = false;
  version = process.argv[3];

  let socketName = process.argv[4];
  ipc.init(socketName);
} else {
  //const { ipcRenderer, remote } = require("electron");
  isDev = true;
  //version = remote.app.getVersion();

  /*  ipcRenderer.on("set-socket", (event, { name }) => {
    ipc.init(name);
  });  */
}

const getServerName = () => {
  let name;
  regKey.values((err, items) => {
    if (err || (Array.isArray(items) && items.length == 0)) {
      console.log("registry search error", err);
    }
    name =
      err || (Array.isArray(items) && items.length == 0)
        ? null
        : items.filter(elm => elm.name == "DataSource")[0].value;
  });
  return name;
};

const name = getServerName();
ping.promise.probe(name, { timeout: 2 }).then(res => {
  const host = res.alive ? res.numeric_host : fallback;
  console.log(`Method Server ${res.alive ? "alive" : "fallbacked"} at `, host);
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

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      databaseAPI: new databaseAPI({ store })
    })
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server API ready at ${url}`);
  });
});
