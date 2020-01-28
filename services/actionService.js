"use strict";

var Models = require("../models");

var updateAction = function (criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Action.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createAction = function (objToSave, callback) {
  new Models.Action(objToSave).save(callback);
};

var deleteAction = function (criteria, callback) {
  Models.Action.findOneAndRemove(criteria, callback);
};

var getAction = function (criteria, projection, options, callback) {
  options.lean = true;
  Models.Action.find(criteria, projection, options, callback);
};

var getAggregateAction = function (criteria, callback) {
  Models.Action.aggregate(criteria, callback);
};

var getPopulatedUsers = function (
  criteria,
  projection,
  populate,
  sortOptions,
  setOptions,
  callback
) {
  Models.Action.find(criteria)
    .select(projection)
    .populate(populate)
    .sort(sortOptions)
    .exec(function (err, result) {
      callback(err, result);
    });
};

module.exports = {
  updateAction: updateAction,
  createAction: createAction,
  deleteAction: deleteAction,
  getAction: getAction,
  getAggregateAction: getAggregateAction,
  getPopulatedUsers: getPopulatedUsers
};
