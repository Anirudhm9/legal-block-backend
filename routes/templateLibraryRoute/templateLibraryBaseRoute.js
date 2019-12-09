var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var createTemplate = {
    method: "POST",
    path: "/api/templateLibrary/createTemplate",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.TemplateLibraryBaseController.createTemplate(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get templates by category",
        tags: ["api", "templateLibrary"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                templateName: Joi.string().required(),
                templateType: Joi.string().required(),
                content: Joi.string().required(),//Joi.string().base64({ allowNewLines: true })
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

var getTemplatesbyCategory = {
    method: "GET",
    path: "/api/templateLibrary/getTemplatesbyCategory",
    handler: function (request, h) {
        return new Promise((resolve, reject) => {
            Controller.TemplateLibraryBaseController.getTemplatesbyCategory(function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Get templates by category",
        tags: ["api", "templateLibrary"],
        plugins: {
            "hapi-swagger": {
                responseMessages:
                    UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var updateTemplate = {
    method: "PUT",
    path: "/api/templateLibrary/updateTemplate",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.TemplateLibraryBaseController.updateTemplate(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Update template by Id",
        tags: ["api", "templateLibrary"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                templateId: Joi.string().required(),
                templateName: Joi.string().required(),
                templateType: Joi.string().required(),
                content: Joi.string().required()
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

var deleteTemplate = {
    method: "DELETE",
    path: "/api/templateLibrary/deleteTemplate",
    handler: function (request, h) {
        var userData =
            (request.auth &&
                request.auth.credentials &&
                request.auth.credentials.userData) ||
            null;
        return new Promise((resolve, reject) => {
            Controller.TemplateLibraryBaseController.deleteTemplate(userData, request.payload, function (err, data) {
                if (!err) {
                    resolve(UniversalFunctions.sendSuccess(null, data));
                } else {
                    reject(UniversalFunctions.sendError(err));
                }
            });
        });
    },
    config: {
        description: "Delete template by Id",
        tags: ["api", "templateLibrary"],
        auth: "UserAuth",
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                templateId: Joi.string().required(),
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
var TemplateBaseRoute = [
    createTemplate,
    getTemplatesbyCategory,
    updateTemplate,
    deleteTemplate
];
module.exports = TemplateBaseRoute;