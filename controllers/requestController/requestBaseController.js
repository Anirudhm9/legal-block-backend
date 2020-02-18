var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");
var mongoose = require('mongoose');

var createRequest = function (userData, payloadData, callback) {
  var request = null;
  var assignee = null;
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
      Service.ContractService.getContract({ _id: payloadData.contractId, assignees: { $in: userData._id } }, {}, {}, function (err, data) {
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
        Service.ContractService.getContract({ _id: payloadData.contractId, assignor: userData._id }, {}, {}, function (err, data) {
          if (err) cb(err)
          else {
            if (data.length == 0) {
              cb(ERROR.INVALID_TRANSACTION);
            }
            else {
              contract = data && data[0] || null;
              cb();
            }
          }
        })
      }
      else {
        cb();
      }
    },
    function (cb) {
      console.log("OKDOASJDOJOS", contract)
      if (contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED) {
        cb();
      }
      else {
        cb(ERROR.INVALID_TRANSACTION);
      }
    },
    function (cb) {
      if (assignee == false) {
        payloadData.requestor = contract.assignor;
        payloadData.respondent = contract.assignees;
      }
      else {
        payloadData.respondent = [contract.assignor];
        payloadData.requestor = userData._id;
      }
      payloadData.response = [{
        user: Config.APP_CONSTANTS.DATABASE.REQUEST_USER_TYPE.REQUESTOR,
        message: payloadData.message
      }]
      payloadData.requestStatus = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED;
      payloadData.dateRequested = Date.now();
      Service.RequestService.createRequest(payloadData, function (err, data) {
        if (err) cb(err)
        else {
          request = data;
          cb();
        }
      })
    },
    function (cb) {
      console.log("<<<<<<>>>>>>", request)
      var objToSave = {
        contractId: payloadData.contractId,
        assignor: contract.assignor,
        assignee: contract.assignees,
        requestId: request._id,
        transactionStatus: Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED,
        transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.REQUEST
      }
      Service.TransactionService.createTransaction(objToSave, function (err, data) {
        if (err) cb(err)
        else {
          cb();
        }
      })
    },
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: request })
  })
}

var createRequestViaAction = function (payloadData, callback) {
  var request = null;
  var assignee = null;
  var contract = null;
  async.series([
    function (cb) {
      Service.ContractService.getContract({ _id: payloadData.contractId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) {
            cb(ERROR.INVALID_TRANSACTION);
          }
          else {
            contract = data && data[0] || null;
            cb();
          }
        }
      })
    },
    function (cb) {
      if (payloadData.userType == Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR) {
        payloadData.requestor = contract.assignor;
        payloadData.respondent = contract.assignees;
      }
      else {
        payloadData.respondent = [contract.assignor];
        payloadData.requestor = payloadData.userId;
      }
      payloadData.response = [{
        user: Config.APP_CONSTANTS.DATABASE.REQUEST_USER_TYPE.REQUESTOR,
        message: payloadData.message,
        userId: payloadData.userId
      }]
      payloadData.requestStatus = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED;
      payloadData.dateRequested = Date.now();
      Service.RequestService.createRequest(payloadData, function (err, data) {
        if (err) cb(err)
        else {
          request = data;
          cb();
        }
      })
    },
    function (cb) {
      console.log("<<<<<<>>>>>>", request)
      var objToSave = {
        contractId: payloadData.contractId,
        assignor: contract.assignor,
        assignee: contract.assignees,
        requestId: request._id,
        transactionStatus: Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED,
        transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.REQUEST,
        transactionSubType: payloadData.transactionSubType,
        requestResponder: payloadData.userId
      }
      Service.TransactionService.createTransaction(objToSave, function (err, data) {
        if (err) cb(err)
        else {
          cb();
        }
      })
    },
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: request })
  })
}

var getRequests = function (userData, callback) {
  var request = null;
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
      var criteria = [
        {
          $match: {
            $or: [
              {
                requestor: userData._id
              },
              {
                respondent: { $in: [userData._id] }
              }
            ]
          },
        },
        {
          $group: {
            _id: '$contractId',
            requests: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            'requests.requestInfo': 0,
            'requests.response': 0,
          }
        }
      ]
      Service.RequestService.getAggregateRequest(criteria, function (err, data) {
        if (err) cb(err)
        else {
          request = data;
          cb();
        }
      })
    },
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: request })
  })
}

var getRequestById = function (userData, payloadData, callback) {
  var request = null;
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
        _id: payloadData.requestId,
      }
      var path = "response.userId";
      var select = "firstName lastName";
      var populate = {
        path: path,
        match: {},
        select: select,
        options: {
          lean: true
        }
      };
      var projection = {
        __v: 0
      };
      Service.RequestService.getPopulatedUsers(criteria, projection, populate, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          request = data;
          cb();
        }
      })
    },
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: request })
  })
}

var respondToRequest = function (userData, payloadData, callback) {
  var request = null;
  var contract = null;
  var response = {
    user: '',
    message: ''
  }
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
      var criteria =
      {
        _id: mongoose.Types.ObjectId(payloadData.requestId),
        $or: [
          {
            requestor: userData._id
          },
          {
            respondent: { $in: [userData._id] }
          }
        ],
      }
      Service.RequestService.getRequest(criteria, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          request = data && data[0];
          cb();
        }
      })
    },
    function (cb) {
      console.log(request.requestStatus)
      if (request.requestStatus == Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED || request.requestStatus == Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.PROCESSING) {
        cb();
      }
      else cb(ERROR.INVALID_TRANSACTION);
    },
    function (cb) {
      console.log("!!!!!!!!!!", request)
      var criteria = {
        _id: request.contractId
      }
      Service.ContractService.getContract(criteria, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data && data.length == 0) {
            cb(ERROR.INVALID_TRANSACTION)
          }
          else {
            contract = data && data[0] || null;
            cb();
          }
        }
      })
    },

    function (cb) {
      if (String(request.requestor) == String(userData._id)) {
        response.user = Config.APP_CONSTANTS.DATABASE.REQUEST_USER_TYPE.REQUESTOR;
        response.message = payloadData.message;
        response.userId = userFound._id;
      }
      else {
        response.user = Config.APP_CONSTANTS.DATABASE.REQUEST_USER_TYPE.RESPONDENT;
        response.message = payloadData.message
        response.userId = userFound._id;
      }
      cb();
    },
    function (cb) {
      var status = null;
      if (!(String(request.requestor) == String(userData._id))) {
        if (payloadData.approve == "true") {
          status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.APPROVED;
        }
        else if (payloadData == "false") {
          status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.DENIED;
        }
        else {
          status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.PROCESSING;
        }
      }
      else {
        status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.PROCESSING
      }

      var criteria = {
        _id: payloadData.requestId
      }
      var dataToSet = {
        $addToSet: {
          response: response
        },
        $set: {
          requestStatus: status,
          updatedAt: Date.now()
        }
      }
      Service.RequestService.updateRequest(criteria, dataToSet, {}, function (err, data) {
        if (err) cb(err)
        else {
          request = data;
          cb();
        }
      })

    },
    function (cb) {
      console.log("<<<<<<<>>>>>>>>", request)
      var status = null;
      if (!(String(request.requestor) == String(userData._id))) {
        if (payloadData.approve == "true") {
          status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.APPROVED
        }
        else if (payloadData.approve == "false") {
          status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.DENIED
        }
        else {
          status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.PROCESSING
        }
      }
      else {
        status = Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.PROCESSING
      }

      var objToSave = {
        contractId: request.contractId,
        requestId: payloadData.requestId,
        assignee: contract.assignees,
        assignor: contract.assignor,
        transactionStatus: status,
        transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.REQUEST,
        requestResponder: userData._id,
        transactionSubType: request.requestType,
      }
      Service.TransactionService.createTransaction(objToSave, function (err, data) {
        if (err) cb(err)
        else {
          transaction = data && data[0] || null;
          cb();
        }
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: request })
  })
}

module.exports = {
  createRequest: createRequest,
  getRequests: getRequests,
  respondToRequest: respondToRequest,
  createRequestViaAction: createRequestViaAction,
  getRequestById: getRequestById
};