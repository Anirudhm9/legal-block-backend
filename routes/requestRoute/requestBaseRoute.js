var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var createRequest = {
  method: "POST",
  path: "/api/requests/createRequest",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.RequestBaseController.createRequest(userData, request.payload, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Create a request",
    tags: ["api", "request"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        requestType: Joi.string().valid(
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.COMPLAIN,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.MAINTENANCE,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.QUERY,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.RESPOND,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.TERMINATE
        ),
        contractId: Joi.string().required(),
        message: Joi.string().required(),
      }
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var getRequests = {
  method: "GET",
  path: "/api/requests/getRequests",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.RequestBaseController.getRequests(userData, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Get all requests/complains",
    tags: ["api", "request"],
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
    },
    auth: "UserAuth",
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var respondToRequest = {
  method: "PUT",
  path: "/api/requests/respondToRequest",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.RequestBaseController.respondToRequest(userData, request.payload, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Respond to a request",
    tags: ["api", "request"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        requestId: Joi.string().required(),
        message: Joi.string().required(),
        approve: Joi.string().valid(["true", "false", "other"])
      }
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var RequestBaseRoute = [
  createRequest,
  getRequests,
  respondToRequest
];
module.exports = RequestBaseRoute;