"use strict";

var Models = require("../models");

var updateTemplate = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.TemplateLibrary.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createTemplate = function (objToSave, callback) {
    new Models.TemplateLibrary(objToSave).save(callback);
};

var deleteTemplate = function (criteria, callback) {
    Models.TemplateLibrary.findOneAndRemove(criteria, callback);
};


var getTemplate = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.TemplateLibrary.find(criteria, projection, options, callback);
};


var getAggregateTemplates = function (criteria, callback) {
    Models.TemplateLibrary.aggregate(criteria, callback);
};

module.exports = {
    updateTemplate: updateTemplate,
    createTemplate: createTemplate,
    deleteTemplate: deleteTemplate,
    getTemplate: getTemplate,
    getAggregateTemplates: getAggregateTemplates
};
