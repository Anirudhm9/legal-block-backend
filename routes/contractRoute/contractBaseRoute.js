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
                contractType: Joi.string().valid(
                    Config.APP_CONSTANTS.DATABASE.CONTRACT_TYPE.REAL_ESTATE
                ).required(),
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

var getContractByIdForAdmin = {
    method: "POST",
    path: "/api/contracts/admin/getContractById",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractByIdForAdmin(userData, request.payload, function (err, data) {
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

var getContractTimeLineById = {
    method: "POST",
    path: "/api/transactions/getContractTimeLineById",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractTimeLineById(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get Contract TimeLine By Id",
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

var getContractTimeLineByIdForAdmin = {
    method: "POST",
    path: "/api/admin/transactions/getContractTimeLineById",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractTimeLineByIdForAdmin(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get Contract TimeLine By Id",
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

var getContractStatuses = {
    method: "GET",
    path: "/api/contracts/getContractStatuses",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.getContractStatuses(userData, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get Contract Statuses",
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

var raiseToRegulator = {
    method: "PUT",
    path: "/api/contracts/raiseToRegulator",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.raiseToRegulator(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Raise matter to regulator",
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

var respondToContract = {
    method: "PUT",
    path: "/api/admin/contracts/respondToContract",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.ContractBaseController.respondToContract(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Respond To critical Contract",
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
    getContractById,
    getContractTimeLineById,
    getContractStatuses,
    getContractByIdForAdmin,
    getContractTimeLineByIdForAdmin,
    raiseToRegulator,
    respondToContract
];
module.exports = ContractBaseRoute;