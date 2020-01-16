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

var getContractsYouAssigned = {
    method: "GET",
    path: "/api/contracts/getContractsYouAssigned",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractsYouAssigned(userData, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get contracts assigned by you",
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

var getContractById = {
    method: "POST",
    path: "/api/contracts/getContractById",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractById(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get contract by Id",
        tags: ["api", "contracts"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                contractId: Joi.string().required()
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

var getContractsToSign = {
    method: "GET",
    path: "/api/contracts/getContractsToSign",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractsToSign(userData, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get contracts need to signed",
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

var signContract = {
    method: "PUT",
    path: "/api/contracts/signContract",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.signContract(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Sign contract by Id",
        tags: ["api", "contracts"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                contractId: Joi.string().required(),
                signed: Joi.boolean().required(),
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
    getContractsYouAssigned,
    getContractsToSign,
    updateContract,
    deleteContract,
    viewAllContractsByCategory,
    signContract,
    getContractById
];
module.exports = ContractBaseRoute;