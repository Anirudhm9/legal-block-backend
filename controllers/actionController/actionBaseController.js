var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");

var Controller = require("../../controllers/ruleController/ruleBaseController");
var RequestController = require("../../controllers/requestController/requestBaseController");

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
  var name;
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
    // function (cb) {
    //   if (contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED) {
    //     cb()
    //   }
    //   else {
    //     cb(ERROR.INVALID_TRANSACTION)
    //   }
    // },
    function (cb) {
      var criteria = null;
      if (String(contract.assignor) == String(userData._id)) {
        criteria = {
          active: true,
          userType: { $in: [Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR] },
          contractType: contract.contractType,
          onStatus: { $in: [contract.contractStatus] }
        }
      }
      else {
        criteria = {
          active: true,
          userType: { $in: [Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE] },
          contractType: contract.contractType,
          onStatus: contract.contractStatus
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

var getAllActions = function (userData, callback) {
  var actions = null;
  var contract = null;
  var name;
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
      Service.ActionService.getAction({}, { __v: 0, active: 0 }, {}, function (err, data) {
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

var executeAction = function (userData, payloadData, callback) {
  var actions = null;
  var contract = null;
  var assignee = null;
  var user = null;
  var output = [];
  var requestInfo = [];
  var outcome = false;
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
      Service.ContractService.getContract({ _id: payloadData.keysRequired.contractId, assignees: { $in: userData._id } }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data != null && data.length == 0) {
            assignee = false;
            cb();
          }
          else {
            assignee = true;
            contract = data && data[0] || null;
            cb();
          }
        }
      })
    },
    function (cb) {
      if (assignee == false) {
        Service.ContractService.getContract({ _id: payloadData.keysRequired.contractId, assignor: userData._id }, {}, {}, function (err, data) {
          if (err) cb(err)
          else {
            if (data.length == 0) {
              cb(ERROR.INVALID_TRANSACTION);
            }
            else {
              contract = data && data[0] || null;
              user = Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR;
              console.log(contract)
              cb();
            }
          }
        })
      }
      else {
        user = Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE;
        cb();
      }
    },
    // function (cb) {
    //   if (contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED) {
    //     cb()
    //   }
    //   else {
    //     cb(ERROR.INVALID_TRANSACTION)
    //   }
    // },
    function (cb) {
      var criteria = {
        _id: payloadData.actionId,
        onStatus: { $in: [contract.contractStatus] }
      };
      Service.ActionService.getAction(criteria, { __v: 0, active: 0 }, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) {
            cb(ERROR.INVALID_TRANSACTION)
          }
          else {
            actions = data && data[0];
            cb();
          }
        }
      })
    },
    function (cb) {
      var DATA = { userId: userFound._id, transactionSubType: actions.actionName };
      var taskInSeries = [];
      for (var j in actions.rules) {
        (function (j) {
          taskInSeries.push((function (j) {
            return function (embeddedCB) {
              for (var i in actions.keysRequired) {
                DATA[actions.keysRequired[i].name] = payloadData.keysRequired[actions.keysRequired[i].name]
              }
              if (Controller.RULES[actions.rules[j]].userType.indexOf(user) == -1) {
                cb(ERROR.INVALID_TRANSACTION)
              }
              else {
                Controller.RULES[actions.rules[j]].function(DATA, function (err, data) {
                  if (err) cb(err)
                  else {
                    data.condition = Controller.RULES[actions.rules[j]].condition;
                    output.push(data)
                    data.type = actions.rules[j];
                    requestInfo.push(data);
                    DATA = { userId: userFound._id, transactionSubType: actions.actionName };
                    embeddedCB()
                  }
                });
              }
            }
          })(j))
        }(j));
      }
      async.series(taskInSeries, function (err, result) {
        cb(null);
      });
    },
    function (cb) {
      if (actions.actionName != Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.RESPOND) {
        var requestData = {};
        requestData.contractId = payloadData.keysRequired.contractId;
        requestData.message = payloadData.keysRequired.message;
        requestData.request = payloadData.keysRequired;
        requestData.requestType = actions.actionName;
        requestData.userType = user;
        requestData.userId = userFound._id;
        requestData.requestInfo = requestInfo;
        requestData.transactionSubType = actions.actionName
        RequestController.createRequestViaAction(requestData, function (err, data) {
          if (err) cb(err)
          else {
            outcome = true;
            cb()
          };
        })
      }
      else {
        cb(ERROR.INVALID_TRANSACTION);
      }
    },
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: output, outcome: { passed: outcome } })
  })
}
module.exports = {
  createAction: createAction,
  getActions: getActions,
  updateAction: updateAction,
  deleteAction: deleteAction,
  executeAction: executeAction,
  getAllActions: getAllActions
};