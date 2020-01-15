var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var createContract = {
    method: "POST",
    path: "/api/contracts/createContract",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.createContract(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Create contract",
        tags: ["api", "contracts"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                contractName: Joi.string().required(),
                content: Joi.string().required(),
                contractType: Joi.string().required(),
                assignees: Joi.array().required(),
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

var viewAllContractsByCategory = {
    method: "GET",
    path: "/api/contracts/admin/viewAllContractsByCategory",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.viewAllContractsByCategory(userData, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get all contracts of every user by category",
        tags: ["api", "contracts"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
        },
        plugins: {
            "hapi-swagger": {
                responseMessages:
                    UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var getContractsbyCategory = {
    method: "GET",
    path: "/api/contracts/getContractsbyCategory",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractsbyCategory(userData, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get contracts by category",
        tags: ["api", "contracts"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
        },
        plugins: {
            "hapi-swagger": {
                responseMessages:
                    UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var updateContract = {
    method: "PUT",
    path: "/api/contracts/updateContract",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.updateContract(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Update contract by Id",
        tags: ["api", "contracts"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                contractId: Joi.string().required(),
                contractName: Joi.string().required(),
                assignees: Joi.string().required(),
                content: Joi.string().required(),
                contractType: Joi.string().required(),
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

var deleteContract = {
    method: "DELETE",
    path: "/api/contracts/deleteContract",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.deleteContract(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Delete contract by Id",
        tags: ["api", "contracts"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                contractId: Joi.string().required(),
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
var ContractBaseRoute = [
    createContract,
    getContractsbyCategory,
    updateContract,
    deleteContract,
    viewAllContractsByCategory
];
module.exports = ContractBaseRoute;