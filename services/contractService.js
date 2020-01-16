"use strict";

var Models = require("../models");

var updateContracts = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Contracts.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createContract = function (objToSave, callback) {
    new Models.Contracts(objToSave).save(callback);
};

var deleteContract = function (criteria, callback) {
    Models.Contracts.findOneAndRemove(criteria, callback);
};


var getContract = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Contracts.find(criteria, projection, options, callback);
};

var getAggregateContracts = function (criteria, callback) {
    Models.Contracts.aggregate(criteria, callback);
};

var getPopulatedUsers = function (
    criteria,
    projection,
    populate,
    sortOptions,
    setOptions,
    callback
) {
    Models.Contracts.find(criteria)
        .select(projection)
        .populate(populate)
        .sort(sortOptions)
        .exec(function (err, result) {
            callback(err, result);
        });
};
module.exports = {
    updateContracts: updateContracts,
    createContract: createContract,
    deleteContract: deleteContract,
    getContract: getContract,
    getAggregateContracts: getAggregateContracts,
    getPopulatedUsers: getPopulatedUsers
};
