/* import http from "http";
import https from "https";
import BaseExpressServer from "./BaseExpressServer"; */
const http = require("http");
const https = require("https");
const BaseExpressServer = require("./BaseExpressServer");
class HttpExpressServer extends BaseExpressServer {
  initialize(port = 3000) {
    this.setupMiddleware();
    this.server = http.createServer(this.app);
    return this.listenOnPort(port);
  }
}

class HttpsExpressServer extends BaseExpressServer {
  initialize(port = 3000, credentials) {
    if (!credentials) {
      throw new Error("HTTPS server requires credentials");
    }
    this.setupMiddleware();
    this.server = https.createServer(credentials, this.app);
    return this.listenOnPort(port);
  }
}
module.exports = { HttpExpressServer, HttpsExpressServer };
/* export { HttpExpressServer, HttpsExpressServer };
 */