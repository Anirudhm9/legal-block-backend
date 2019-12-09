"use strict";

var Models = require("../models");

var updatePersonalTemplate = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.PersonalTemplate.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createPersonalTemplate = function (objToSave, callback) {
    new Models.PersonalTemplate(objToSave).save(callback);
};

var deletePersonalTemplate = function (criteria, callback) {
    Models.PersonalTemplate.findOneAndRemove(criteria, callback);
};


var getPersonalTemplate = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.PersonalTemplate.find(criteria, projection, options, callback);
};



module.exports = {
    updatePersonalTemplate: updatePersonalTemplate,
    createPersonalTemplate: createPersonalTemplate,
    deletePersonalTemplate: deletePersonalTemplate,
    getPersonalTemplate: getPersonalTemplate,
};
