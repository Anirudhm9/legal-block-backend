var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");

var createTemplate = function (userData, payloadData, callback) {
    var templates = null;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData._id
            };
            Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
                if (err) cb(err);
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
                    else {
                        userFound = (data && data[0]) || null;
                        cb();
                    }
                }
            });
        },

        function (cb) {

            Service.TemplateLibraryService.createTemplate(payloadData, function (err, data) {
                if (err) cb(err)
                else {
                    templates = data;
                    cb();
                }
            })
        },


    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: templates })
    })
}

var getTemplatesbyCategory = function (callback) {
    var templates = null;
    async.series([

        function (cb) {
            criteria = [
                {
                    $group: {
                        _id: '$templateType',
                        templates: { $push: "$$ROOT" }
                    },
                    // $project:
                    // {

                    // }
                },
            ]
            Service.TemplateLibraryService.getAggregateTemplates(criteria, function (err, data) {
                if (err) cb(err)
                else {
                    templates = data;
                    cb();
                }
            })
        },
    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: templates })
    })
}

var updateTemplate = function (userData, payloadData, callback) {
    var templates = null;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData._id
            };
            Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
                if (err) cb(err);
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
                    else {
                        userFound = (data && data[0]) || null;
                        cb();
                    }
                }
            });
        },

        function (cb) {
            var dataToSet = {
                templateName: payloadData.templateName,
                templateType: payloadData.templateType,
                content: payloadData.content,
            }
            Service.TemplateLibraryService.updateTemplate({ _id: payloadData.templateId }, dataToSet, {}, function (err, data) {
                if (err) cb(err)
                else {
                    templates = data;
                    cb();
                }
            })
        },


    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: templates })
    })
}

var deleteTemplate = function (userData, payloadData, callback) {
    var templates = null;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData._id
            };
            Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
                if (err) cb(err);
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
                    else {
                        userFound = (data && data[0]) || null;
                        cb();
                    }
                }
            });
        },

        function (cb) {

            Service.TemplateLibraryService.deleteTemplate({ _id: payloadData.templateId }, function (err, data) {
                if (err) cb(err)
                else {
                    cb();
                }
            })
        },


    ], function (err, result) {
        if (err) callback(err)
        else callback(null)
    })
}

module.exports = {
    createTemplate: createTemplate,
    getTemplatesbyCategory: getTemplatesbyCategory,
    updateTemplate: updateTemplate
};