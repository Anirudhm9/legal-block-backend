var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var transaction = new Schema({
  contractId: { type: Schema.ObjectId, ref: 'contracts' },
  requestId: { type: Schema.ObjectId, ref: 'request' },
  assignee: [
    { type: Schema.ObjectId, ref: 'user' }
  ],
  assignor: { type: Schema.ObjectId, ref: 'user' },
  transactionStatus: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.APPROVED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.DENIED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.PROCESSING,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.COMPLETED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.INITIATED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.FAILATTEMPT
    ]
  },
  failAttempt: { type: String },
  requestResponder: { type: Schema.ObjectId, ref: 'user' },
  transactionType: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.CONTRACT,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_TYPE.REQUEST
    ]
  },
  transactionSubType: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.COMPLAIN,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.MAINTENANCE,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.QUERY,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.TERMINATE,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.CRITICALREQUEST,
    ]
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("transaction", transaction);