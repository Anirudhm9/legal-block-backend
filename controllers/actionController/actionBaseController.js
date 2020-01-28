var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");

var createAction = function (userData, payloadData, callback) {
  var actions = null;
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
      Service.ActionService.createAction(payloadData, function (err, data) {
        if (err) cb(err)
        else {
          actions = data;
          cb();
        }
      })
    },


  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: actions })
  })
}

var getActions = function (userData, payloadData, callback) {
  var actions = null;
  var contract = null;
  async.series([

    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.UserService.getUser(criteria, { password: 0 }, {}, function (err, data) {
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
      var criteria = {
        _id: payloadData.contractId
      }
      Service.ContractService.getContract(criteria, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          contract = data && data[0] || null;
          cb();
        }
      })
    },
    function (cb) {
      if (contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED) {
        cb()
      }
      else {
        cb(ERROR.INVALID_TRANSACTION)
      }
    },
    function (cb) {
      var criteria = null;
      if (String(contract.assignor) == String(userData._id)) {
        criteria = {
          active: true,
          userType: { $in: [Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR] },
          contractType: contract.contractType
        }
      }
      else {
        criteria = {
          active: true,
          userType: { $in: [Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE] },
          contractType: contract.contractType
        }
      }
      Service.ActionService.getAction(criteria, { __v: 0, active: 0 }, {}, function (err, data) {
        if (err) cb(err)
        else {
          actions = data;
          cb();
        }
      })
    }

  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: actions })
  })
}

var updateAction = function (userData, payloadData, callback) {
  var actions = null;
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
        $set: {
          actionName: payloadData.actionName,
          contractType: payloadData.contractType,
          userType: payloadData.userType,
          keysRequired: payloadData.keysRequired
        },
      }
      Service.ActionService.updateAction({ _id: payloadData.actionId, active: true }, dataToSet, {}, function (err, data) {
        if (err) cb(err)
        else {
          actions = data;
          cb();
        }
      })
    },


  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: actions })
  })
}

var deleteAction = function (userData, payloadData, callback) {
  var action = null;
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
      Service.ActionService.updateAction({ _id: payloadData.actionId, active: true }, { $set: { active: false } }, {}, function (err, data) {
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
  createAction: createAction,
  getActions: getActions,
  updateAction: updateAction,
  deleteAction: deleteAction
};