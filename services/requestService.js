"use strict";

var Models = require("../models");

var updateRequest = function (criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Request.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createRequest = function (objToSave, callback) {
  new Models.Request(objToSave).save(callback);
};

var deleteRequest = function (criteria, callback) {
  Models.Request.findOneAndRemove(criteria, callback);
};

var getRequest = function (criteria, projection, options, callback) {
  options.lean = true;
  Models.Request.find(criteria, projection, options, callback);
};

var getAggregateRequest = function (criteria, callback) {
  Models.Request.aggregate(criteria, callback);
};

var getPopulatedUsers = function (
  criteria,
  projection,
  populate,
  sortOptions,
  setOptions,
  callback
) {
  Models.Request.find(criteria)
    .select(projection)
    .populate(populate)
    .sort(sortOptions)
    .exec(function (err, result) {
      callback(err, result);
    });
};

module.exports = {
  updateRequest: updateRequest,
  createRequest: createRequest,
  deleteRequest: deleteRequest,
  getRequest: getRequest,
  getAggregateRequest: getAggregateRequest,
  getPopulatedUsers: getPopulatedUsers
};
