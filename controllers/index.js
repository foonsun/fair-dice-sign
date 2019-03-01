"use strict";
const express = require("express");
const config = require("config");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const logger = require("../helpers/logger");
const expressValidator = require("express-validator");
const joi = require("joi");
const compression = require("compression");
const port = config.get("port");
var app = express();
var router = new express.Router();

var session = require("express-session");
app.use(
  session({
    secret:
      "AAAAB3NzaC1yc2EAAAADAQABAAABAQCZ3da9NjuhYZv1PosJ+njjIQfn291tZt9MMLLtbHmqWFZckhnERnqkqijBJ11U9GBZxJTisQJN0B8opyTlo6zcIBZ7e5rrpCCgxYRR/sHj5C9qvwkXSJ8h1anQx6/IhASXWawGeTU7TZUqfS2JkAGj839zMCMPGQVOcmp9E544FyDGWGvunagNlhkizMW/xpCN8C7Ohnna4hP8kB/9tP4HME0v0KaSkKNbhgA/UssZQxZ18l9flwOCX6mj3HW7dhHAyC5NBkFvVxfVfIeOaDJlENu3T06PecFIkTWIEKhb8yExkHBJKj16DwJI+z4aAOMiOQKAYAFzcpVWDvs7V3nJ", // TODO
    resave: false,
    saveUninitialized: true
  })
);

// Allow cross origin
// TODO: 后续做严谨的配置
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, token");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});

// 获取请求的IP地址
app.enable("trust proxy");
app.use(
  morgan("short", {
    stream: logger.stream
  })
);

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(
  bodyParser.json({
    limit: "20mb"
  })
);

app.use(
  expressValidator({
    customValidators: {
      validateJoiSchema: function(value, schema) {
        var result = joi.validate(value, schema);
        return !result.error;
      }
    }
  })
);

// compression
app.use(compression());

router.use("/api/v1", require("./v1"));

// API不存在时返回404
router.use("/*", function(req, res, next) {
  var err = new Error("API Not Found");
  err.status = 404;
  next(err);
});

app.use(router);

// 生产环境和开发环境错误处理
app.use(function(err, req, res, next) {
  logger.error(err);

  res.status(err.status || 500);
  res.json({
    error: err.message,
    code: err.code
  });
  next(err);
});

app.listen(port, function() {
  logger.info(
    `api-server listen on port ${port}, in ${process.env.NODE_ENV} mode`
  );
});

module.exports = app;
