const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middleWares = jsonServer.defaults();

const port = 9000;
server.use(middleWares);
server.use(router);

server.listen(port)