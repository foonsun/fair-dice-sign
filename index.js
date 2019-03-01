if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

if (!process.env.MONGO_HOST) {
    process.env.MONGO_HOST = "localhost";
}

const cluster = require("cluster");
const logger = require("./helpers/logger.js");
const config = require("config");

if (cluster.isMaster) {
    // 启动worker子进程
    for (var i = 0; i < config.numOfSlaves; i++) {
        cluster.fork();
    }

    // 当子进程由于out of memory退出时，重启子进程
    cluster.on("exit", function(worker, code, signal) {
        logger.error(
            `worker ${
                worker.process.pid
            } died with code = ${code} and signal = ${signal}`
        );
        cluster.fork();
    });
} else {
    require("./controllers");
}
