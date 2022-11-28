const path = require("path");
const config = require(path.join(__dirname, "..", "config"));
const utils = require(path.join(__dirname, "..", "utils"));
const { Worker } = require("worker_threads");
const StatusCodes = require("http-status-codes").StatusCodes;
const { isEmpty } = require("lodash");

module.exports.register = (app) => {
  // add new case
  app.post("/add", (req, res) => {
    if (utils.authenticate(req.headers.authorization)) {
      const worker = new Worker(path.join(__dirname, '..', '..', 'workers', 'case', 'add.js'));
      // listen to message to wait response from worker
      worker.on("message", (data) => {
        res.status(data.statusCode === config.statusCode.FAIL ? StatusCodes.NOT_ACCEPTABLE : StatusCodes.OK).send({ ...data });
      });
      // post data
      worker.postMessage(req.body);
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({});
    }
  })
  // modify case
  app.post("/update", (req, res) => {
    if (utils.authenticate(req.headers.authorization)) {
      const worker = new Worker(path.join(__dirname, '..', '..', 'workers', 'case', 'update.js'));
      // listen to message to wait response from worker
      worker.on("message", (data) => {
        res.status(data.statusCode === config.statusCode.FAIL ? StatusCodes.NOT_ACCEPTABLE : StatusCodes.OK).send({ ...data });
      });
      // post data
      worker.postMessage(req.body);
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({});
    }
  })  
}
