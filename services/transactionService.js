"use strict";

var Models = require("../models");

var updateTransaction = function (criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Transaction.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createTransaction = function (objToSave, callback) {
  new Models.Transaction(objToSave).save(callback);
};

var deleteTransaction = function (criteria, callback) {
  Models.Transaction.findOneAndRemove(criteria, callback);
};


var getTransaction = function (criteria, projection, options, callback) {
  options.lean = true;
  Models.Transaction.find(criteria, projection, options, callback);
};

var getAggregateTransaction = function (criteria, callback) {
  Models.Transaction.aggregate(criteria, callback);
};

var getPopulatedUsers = function (
  criteria,
  projection,
  populate,
  sortOptions,
  setOptions,
  callback
) {
  Models.Transaction.find(criteria)
    .select(projection)
    .populate(populate)
    .sort(sortOptions)
    .exec(function (err, result) {
      callback(err, result);
    });
};

module.exports = {
  updateTransaction: updateTransaction,
  createTransaction: createTransaction,
  deleteTransaction: deleteTransaction,
  getTransaction: getTransaction,
  getAggregateTransaction: getAggregateTransaction,
  getPopulatedUsers: getPopulatedUsers
};
