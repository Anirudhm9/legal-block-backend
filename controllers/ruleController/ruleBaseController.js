var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");


var RULES = {
  CHECKEXPIRY: {
    userType: [Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE],
    condition: "Termination date should be atleast 30 Days from the date of submission",
    keys: [
      "leaseEndDate",
      "terminationDate",
      "contractId"
    ],
    function: (data, callback) => CHECKEXPIRY(data, callback)
  },
  CALCULATEFINE: {
    userType: [Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE],
    condition: "This fine calculated is the 1% of the remaining rent and 200$ as additional costs for the advertisement",
    keys: [
      "leaseEndDate",
      "terminationDate",
      "contractId"
    ],
    function: (data, callback) => CALCULATEFINE(data, callback)
  },
  CHECKINTERVAL: {
    userType: [Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE, Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR],
    condition: "Another request can not be made within a time frame of 24 hours",
    keys: [
      "requestType",
      "contractId",
      "message"
    ],
    function: (data, callback) => CHECKINTERVAL(data, callback)
  }
};

var failTransaction = function (payloadData, errorData, callback) {
  var contract = null;
  async.series([
    function (cb) {
      Service.ContractService.getContract({ _id: payloadData.contractId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          contract = data && data[0] || null;
          cb();
        }
      })
    },
    function (cb) {
      var objToSave = {
        contractId: payloadData.contractId,
        assignor: contract.assignor,
        assignee: contract.assignees,
        transactionStatus: Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.FAILATTEMPT,
        transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.REQUEST,
        transactionSubType: payloadData.transactionSubType,
        requestResponder: payloadData.userId,
        failAttempt: errorData
      }
      Service.TransactionService.createTransaction(objToSave, function (err, data) {
        if (err) cb(err)
        else cb();
      })
    }
  ],
    function (err, result) {
      if (err) callback(err)
      else callback(null, { data: null })
    })
}

var CHECKEXPIRY = function (payloadData, callback) {
  var contract = null;
  var outcome = false;
  var leaseEndDate = new Date(payloadData.leaseEndDate);
  var terminationDate = new Date(payloadData.terminationDate);
  async.series([

    function (cb) {
      Service.ContractService.getContract({ _id: payloadData.contractId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          contract = data && data[0] || null;
          cb();
        }
      })
    },

    function (cb) {
      if (contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED) {
        cb();
      }
      else {
        failTransaction(payloadData, INVALID_CONTRACT_STATE.customMessage, function (err, data) {
          if (err) cb(err)
          else cb(ERROR.INVALID_CONTRACT_STATE);
        })
      }
    },

    function (cb) {
      var date = new Date();
      if ((leaseEndDate < terminationDate) || (date > terminationDate) || ((terminationDate.getTime() - date.getTime()) / (1000 * 3600 * 24)) < 30) {

        failTransaction(payloadData, ERROR.INVALID_TERMINATION_DATE.customMessage, function (err, data) {
          if (err) cb(err)
          else cb(ERROR.INVALID_TERMINATION_DATE);
        })
      }
      else {
        outcome = true;
        cb();
      }
    },

  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: null, result: outcome })
  })
}

var CALCULATEFINE = function (payloadData, callback) {
  var fine = 0;
  var leaseEndDate = new Date(payloadData.leaseEndDate);
  var terminationDate = new Date(payloadData.terminationDate);
  async.series([

    function (cb) {
      Service.ContractService.getContract({ _id: payloadData.contractId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          contract = data && data[0] || null;
          cb();
        }
      })
    },

    function (cb) {
      contract.rent = 1500;
      fine = (((leaseEndDate.getTime() - terminationDate.getTime()) / (1000 * 3600 * 24)) * (contract.rent / 30) * 0.01) + 200;
      outcome = true;
      cb();
    },

    function (cb) {
      payloadData.fine = fine;
      console.log(payloadData)
      cb();
    }

  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: fine, result: outcome })
  })
}

var CHECKINTERVAL = function (payloadData, callback) {
  var contract = null;
  var outcome = false;
  async.series([

    function (cb) {
      Service.ContractService.getContract({ _id: payloadData.contractId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          contract = data && data[0] || null;
          cb();
        }
      })
    },

    function (cb) {
      if (contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED) {
        cb();
      }
      else {
        failTransaction(payloadData, ERROR.INVALID_CONTRACT_STATE.customMessage, function (err, data) {
          if (err) cb(err)
          else cb(ERROR.INVALID_CONTRACT_STATE);
        })
      }
    },

    function (cb) {
      var date = new Date();
      var criteria = {
        transactionSubType: payloadData.transactionSubType,
        transactionStatus: Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED,
        requestResponder: payloadData.userId,
      }
      Service.TransactionService.getTransaction(criteria, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) {
            outcome = true;
            cb();
          }
          else {
            if (((data[0].date.getTime() - date.getTime()) / (1000 * 3600 * 24)) <= 1) {
              failTransaction(payloadData, ERROR.INVALID_REQUEST.customMessage, function (err, data) {
                if (err) cb(err)
                else {
                  cb(ERROR.INVALID_REQUEST);
                }
              })
            }
            else {
              outcome = true;
              cb()
            }
          }
        }
      })
    },

  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: null, result: outcome })
  })
}

module.exports = {
  RULES: RULES
};