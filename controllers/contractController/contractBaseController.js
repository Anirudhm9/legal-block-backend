var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");
var NodeMailer = require('../../lib/nodeMailer');

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
            if (payloadData.assignees.indexOf(String(userData._id)) == -1) {
                cb();
            }
            else {
                cb(ERROR.INVALID_ASSIGNEE);
            }
        },
        function (cb) {
            payloadData.assignor = userData._id
            payloadData.contractStatus = Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.PROCESSING;
            Service.ContractService.createContract(payloadData, function (err, data) {
                if (err) cb(err)
                else {
                    contract = data;
                    cb();
                }
            })
        },
        function (cb) {
            console.log(contract)
            var objToSave = {
                contractId: contract._id,
                assignor: userFound._id,
                transactionStatus: Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED,
                transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.CONTRACT
            }
            Service.TransactionService.createTransaction(objToSave, function (err, data) {
                if (err) cb(err)
                else {
                    cb();
                }
            })
        },
        function (cb) {
            var taskInParallel = [];
            for (var key in payloadData.assignees) {
                (function (key) {
                    taskInParallel.push((function (key) {
                        return function (embeddedCB) {
                            Service.UserService.getUser({
                                _id: payloadData.assignees[key]
                            }, {}, {
                                lean: true
                            }, function (err, data) {
                                if (err) {
                                    embeddedCB(err)
                                } else {
                                    var user = data && data[0] || null;
                                    console.log(user.emailId)
                                    var name = user.firstName + ' ' + user.lastName;
                                    //NodeMailer.sendContractMail(user.emailId, name);
                                    embeddedCB()
                                }
                            })
                        }
                    })(key))
                }(key));
            }
            async.parallel(taskInParallel, function (err, result) {
                cb(null);
            });
        }
    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: contract })
    })
}

var signContract = function (userData, payloadData, callback) {
    var contract = null;
    var assignorDenied = false;
    var assigneeDenied = false;
    var DATA = null;
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
                _id: payloadData.contractId,
                $or: [
                    {
                        assignor: userData._id
                    },
                    {
                        assignees: {
                            $in: [userData._id]
                        }
                    }
                ]
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
            if (contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED || contract.contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED) {
                cb(ERROR.INVALID_TRANSACTION);
            }
            else cb();
        },
        function (cb) {
            if (payloadData.signed == false) {
                if (String(contract.assignor) == String(userData._id)) {
                    Service.ContractService.updateContracts({ _id: payloadData.contractId }, { $set: { contractStatus: Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED, updatedAt: Date.now() } }, {}, function (err, data) {
                        if (err) cb(err)
                        else {
                            assignorDenied = true;
                            DATA = data;
                            cb();
                        }
                    })
                }
                else {
                    Service.ContractService.updateContracts({ _id: payloadData.contractId }, { $set: { contractStatus: Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED, updatedAt: Date.now() } }, {}, function (err, data) {
                        if (err) cb(err)
                        else {
                            assigneeDenied = true;
                            DATA = data;
                            cb();
                        }
                    })
                }
            }
            else {
                cb();
            }
        },
        function (cb) {
            var objToSave = null;
            if ((String(contract.assignor) == String(userData._id) && assignorDenied == true) || (String(contract.assignor) == String(userData._id) && contract.assignees.length == contract.assigneesSigned.length)) {
                objToSave = {
                    contractId: payloadData.contractId,
                    assignor: userData._id,
                    transactionStatus: payloadData.signed == true ? Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.INITIATED : Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.DENIED,
                    transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.CONTRACT
                }
            }
            else if ((contract.assignees.length != contract.assigneesSigned.length) && String(contract.assignor) != String(userData._id)) {
                objToSave = {
                    contractId: payloadData.contractId,
                    assignee: [userData._id],
                    transactionStatus: payloadData.signed == true ? Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.APPROVED : Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.DENIED,
                    transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.CONTRACT
                }
            }
            else {
                cb(ERROR.INVALID_TRANSACTION);
            }
            if (objToSave) {
                Service.TransactionService.createTransaction(objToSave, function (err, data) {
                    if (err) cb(err)
                    else cb();
                })
            }
        },
        function (cb) {
            var dataToSet = {};
            if (String(contract.assignor) == String(userData._id) && !assignorDenied) {
                dataToSet = {
                    $set: {
                        contractStatus: Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED,
                        updatedAt: Date.now()
                    }
                }
                Service.ContractService.updateContracts({ _id: payloadData.contractId }, dataToSet, {}, function (err, data) {
                    if (err) cb(err)
                    else {
                        DATA = data;
                        cb();
                    }
                })
            }
            else if (String(contract.assignor) != String(userData._id) && !assigneeDenied) {
                dataToSet = {
                    $addToSet: {
                        assigneesSigned: userData._id
                    },
                    $set: {
                        updatedAt: Date.now()
                    }
                }
                Service.ContractService.updateContracts({ _id: payloadData.contractId }, dataToSet, {}, function (err, data) {
                    if (err) cb(err)
                    else {
                        DATA = data;
                        cb();
                    }
                })
            }
            else {
                cb();
            }
            // TO DO: If last user, create a notification for the assignor
        },
    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: null })
    })
}

var getContractById = function (userData, payloadData, callback) {
    var contracts = null;
    async.series([

        function (cb) {
            var criteria = {
                _id: userData._id,
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
            var path = "assignor assignees assigneesSigned";
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
                __v: 0,
            };
            Service.ContractService.getPopulatedUsers(criteria, projection, populate, {}, {}, function (err, data) {
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

var getContractStatuses = function (userData, callback) {
    var contracts = null;
    var statuses = {
        AwaitingMySignature: [],
        WaitingForOthers: [],
        Completed: [],
        Denied: [],
    };
    async.series([

        function (cb) {
            var criteria = {
                _id: userData._id,
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
                                assignor: userData._id
                            },
                            {
                                assignees: {
                                    $in: [userData._id]
                                }
                            }
                        ],
                    }
                },
                {
                    $project: {
                        _id: 1,
                        contractName: 1,
                        contractStatus: 1,
                        dateAssigned: 1,
                        updatedAt: 1,
                        assignor: 1,
                        'assignees': {
                            '$map': {
                                'input': '$assignees',
                                'as': 'assignee',
                                'in':
                                    { $toString: '$$assignee' }
                            }
                        },
                        'assigneesSigned': {
                            '$map': {
                                'input': '$assigneesSigned',
                                'as': 'assigneeSigned',
                                'in':
                                    { $toString: '$$assigneeSigned' }
                            }
                        }
                    }
                }
            ]
            Service.ContractService.getAggregateContracts(criteria, function (err, data) {
                if (err) cb(err)
                else {
                    contracts = data;
                    console.log(contracts)
                    cb();
                }
            })
        },
        function (cb) {
            for (var i in contracts) {
                if ((contracts[i].assignees.includes(String(userData._id)) && !contracts[i].assigneesSigned.includes(String(userData._id)) || (String(contracts[i].assignor) == String(userData._id)) && contracts[i].assigneesSigned.length == contracts[i].assignees.length) && contracts[i].contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.PROCESSING) {
                    statuses.AwaitingMySignature.push(contracts[i]);
                }
                else if ((contracts[i].assigneesSigned.includes(String(userData._id)) || (String(contracts[i].assignor) == String(userData._id))) && contracts[i].contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.PROCESSING) {
                    statuses.WaitingForOthers.push(contracts[i])
                }
                else if (contracts[i].assigneesSigned.length == contracts[i].assignees.length && (contracts[i].contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED)) {
                    statuses.Completed.push(contracts[i])
                }
                else if (contracts[i].contractStatus == Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED) {
                    statuses.Denied.push(contracts[i]);
                }
            }
            cb();
        }
    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { statuses: statuses })
    })
}

var getContractTimeLineById = function (userData, payloadData, callback) {
    var transactions = null;
    async.series([

        function (cb) {
            var criteria = {
                _id: userData._id,
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
                _id: payloadData.contractId,
                $or: [
                    {
                        assignor: userData._id
                    },
                    {
                        assignees: {
                            $in: [userData._id]
                        }
                    }
                ]
            }
            Service.ContractService.getContract(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data && data.length == 0) {
                        cb(ERROR.INVALID_TRANSACTION)
                    }
                    else {
                        contract = data && data[0] || null;
                        console.log(contract)
                        cb();
                    }
                }
            })
        },
        function (cb) {
            var criteria = {
                contractId: payloadData.contractId,
                transactionType: Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.CONTRACT
            }
            var path = "assignor assignee";
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
                __v: 0,
            };
            Service.TransactionService.getPopulatedUsers(criteria, projection, populate, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    transactions = data;
                    cb();
                }
            })
        },
    ], function (err, result) {
        if (err) callback(err)
        else callback(null, { data: transactions })
    })
}
var viewAllContractsByCategory = function (userData, callback) {
    var contracts = null;
    async.series([

        function (cb) {
            var criteria = {
                _id: userData._id,
                userType: Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN
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
            criteria = [
                {
                    $group: {
                        _id: '$contractType',
                        contracts: { $push: "$$ROOT" }
                    },

                },
                {
                    $project: {
                        _id: 1,
                        'contracts': {
                            '$map': {
                                'input': '$contracts',
                                'as': 'contract',
                                'in': {
                                    '_id': '$$contract._id',
                                    'contractName': '$$contract.contractName',
                                    'contractType': '$$contract.contractType',
                                    'dateAssigned': '$$contract.dateAssigned',
                                    'contractStatus': '$$contract.contractStatus',
                                }
                            }
                        }
                    }
                }
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

var getContractsYouAssigned = function (userData, callback) {
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
            console.log(userData._id)
            criteria = [
                {
                    $match: {
                        assignor: userData._id
                    }
                },
                {
                    $group: {
                        _id: '$contractType',
                        contracts: { $push: "$$ROOT" }
                    },
                },
                {
                    $project: {
                        _id: 1,
                        'contracts': {
                            '$map': {
                                'input': '$contracts',
                                'as': 'contract',
                                'in': {
                                    '_id': '$$contract._id',
                                    'contractName': '$$contract.contractName',
                                    'contractType': '$$contract.contractType',
                                    'dateAssigned': '$$contract.dateAssigned',
                                    'contractStatus': '$$contract.contractStatus',
                                }
                            }
                        }
                    }
                }
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

var getContractsToSign = function (userData, callback) {
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
                        assignees: { $in: [userData._id] }
                    }
                },
                {
                    $group: {
                        _id: '$contractType',
                        contracts: { $push: "$$ROOT" }
                    },
                },
                {
                    $project: {
                        _id: 1,
                        'contracts': {
                            '$map': {
                                'input': '$contracts',
                                'as': 'contract',
                                'in': {
                                    '_id': '$$contract._id',
                                    'contractName': '$$contract.contractName',
                                    'contractType': '$$contract.contractType',
                                    'dateAssigned': '$$contract.dateAssigned',
                                    'contractStatus': '$$contract.contractStatus',
                                }
                            }
                        }
                    }
                }
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
                $set: {
                    contractName: payloadData.contractName,
                    contractType: payloadData.contractType,
                    content: payloadData.content,
                    clientName: payloadData.clientName,
                    assignees: payloadData.assignees,
                    dateAssigned: Date.now()
                }
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
    getContractsYouAssigned: getContractsYouAssigned,
    getContractsToSign: getContractsToSign,
    updateContract: updateContract,
    deleteContract: deleteContract,
    viewAllContractsByCategory: viewAllContractsByCategory,
    signContract: signContract,
    getContractById: getContractById,
    getContractTimeLineById: getContractTimeLineById,
    getContractStatuses: getContractStatuses
};