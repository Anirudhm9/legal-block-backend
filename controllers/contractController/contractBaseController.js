var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");

var createContract = function (userData, payloadData, callback) {
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
            payloadData.userId = userData._id
            Service.ContractService.createContract(payloadData, function (err, data) {
                if (err) cb(err)
                else {
                    contract = data;
                    cb();
                }
            })
        },


    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: contract })
    })
}

var getContractsbyCategory = function (userData, callback) {
    var contracts = null;
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
            criteria = [
                {
                    $match: {
                        userId: userData._id
                    }
                },
                {
                    $group: {
                        _id: '$contractType',
                        contracts: { $push: "$$ROOT" }
                    },
                },
            ]
            Service.ContractService.getAggregateContracts(criteria, function (err, data) {
                if (err) cb(err)
                else {
                    contracts = data;
                    cb();
                }
            })
        },
    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: contracts })
    })
}

var updateContract = function (userData, payloadData, callback) {
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
            var dataToSet = {
                contractName: payloadData.contractName,
                contractType: payloadData.contractType,
                content: payloadData.content,
                clientName: payloadData.clientName,
                dateAssigned: Date.now()
            }
            Service.ContractService.updateContracts({ _id: payloadData.contractId, userId: userData._id }, dataToSet, {}, function (err, data) {
                if (err) cb(err)
                else {
                    contract = data;
                    cb();
                }
            })
        },


    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: contract })
    })
}

var deleteContract = function (userData, payloadData, callback) {
    var templates = null;
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

            Service.ContractService.deleteContract({ _id: payloadData.contractId, userId: userData._id }, function (err, data) {
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
    createContract: createContract,
    getContractsbyCategory: getContractsbyCategory,
    updateContract: updateContract,
    deleteContract: deleteContract
};