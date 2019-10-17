const Registry = require("winreg");
const regKey = new Registry({
  hive: Registry.HKCU,
  key: "\\Software\\Anthos\\Method\\4.0\\Generale"
});

let serverName = "";
//todo USE Regkey
regKey.values((err, items) => {
  if (err) return;
  else
    items.forEach(elm => {
      if (elm.name === "path") serverName = elm.value;
    });
});

module.exports = {
  user: "sa",
  password: "startup",
  server: serverName || "192.168.43.164",
  database: "DB1_01",
  options: {
    instanceName: "MSSQLSERVER",
    tdsVersion: "7_1"
  }
};
