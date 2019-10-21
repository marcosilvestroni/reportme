const ipc = require('node-ipc');

function isSocketTaken(name, fn) {
  return new Promise((resolve, reject) => {
    ipc.connectTo(name, () => {
      ipc.of[name].on('error', () => {
        ipc.disconnect(name);
        resolve(false);
      });

      ipc.of[name].on('connect', () => {
        ipc.disconnect(name);
        resolve(true);
      });
    });
  });
}

async function findOpenSocket() {
  let currentSocket = 1;
  console.log('checking', currentSocket);
  while (await isSocketTaken('reportme' + currentSocket)) {
    currentSocket++;
    console.log('checking', currentSocket);
  }
  console.log('found socket', currentSocket);
  return 'reportme' + currentSocket;
}

module.exports = findOpenSocket;