var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var createAction = {
  method: "POST",
  path: "/api/actions/createAction",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.ActionBaseController.createAction(userData, request.payload, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Create an action",
    tags: ["api", "action"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        actionName: Joi.string().valid(
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.COMPLAIN,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.MAINTENANCE,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.QUERY,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.RESPOND,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.TERMINATE
        ),
        contractType: Joi.string().valid(
          Config.APP_CONSTANTS.DATABASE.CONTRACT_TYPE.REAL_ESTATE
        ).required(),
        userType: Joi.array().items(Joi.string().valid([
          Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE,
          Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR,
        ])),
        onStatus: Joi.array().items(
          Joi.string().valid([
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.PROCESSING,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.COMPLETED,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.TERMINATED
          ])
        ),
        keysRequired: Joi.array().items(
          Joi.object(
            {
              name: Joi.string().required(),
              type: Joi.string().required()
            }
          ).required()
        ),
        rules: Joi.array().items(
          Joi.string().valid([
            Config.APP_CONSTANTS.DATABASE.RULES.CALCULATEFINE,
            Config.APP_CONSTANTS.DATABASE.RULES.CHECKEXPIRY,
            Config.APP_CONSTANTS.DATABASE.RULES.CHECKINTERVAL]
          ))
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

var getActions = {
  method: "POST",
  path: "/api/actions/getActions",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.ActionBaseController.getActions(userData, request.payload, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Get actions",
    tags: ["api", "action"],
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        contractId: Joi.string().required()
      }
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

var updateAction = {
  method: "PUT",
  path: "/api/actions/updateAction",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.ActionBaseController.updateAction(userData, request.payload, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Update action",
    tags: ["api", "action"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        actionId: Joi.string().required(),
        actionName: Joi.string().valid(
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.COMPLAIN,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.MAINTENANCE,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.QUERY,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.RESPOND,
          Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.TERMINATE
        ),
        contractType: Joi.string().required(),
        onStatus: Joi.array().items(
          Joi.string().valid([
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.PROCESSING,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.COMPLETED,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED,
            Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.TERMINATED
          ])
        ),
        userType: Joi.array().items(Joi.string().valid([
          Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE,
          Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR,
        ])),
        keysRequired: Joi.array().items(
          Joi.object(
            {
              name: Joi.string().required(),
              type: Joi.string().required()
            }
          ).required()
        )
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

var deleteAction = {
  method: "DELETE",
  path: "/api/actions/deleteAction",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.ActionBaseController.deleteAction(userData, request.payload, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Delete action",
    tags: ["api", "action"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        actionId: Joi.string().required(),
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

var executeAction = {
  method: "POST",
  path: "/api/actions/executeAction",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.ActionBaseController.executeAction(userData, request.payload, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "Execute Action",
    tags: ["api", "action"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        actionId: Joi.string().required(),
        keysRequired: Joi.object().required()
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
var ActionBaseRoute = [
  createAction,
  getActions,
  updateAction,
  deleteAction,
  executeAction
];
module.exports = ActionBaseRoute;