var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var transaction = new Schema({
  contractId: { type: Schema.ObjectId, ref: 'contracts' },
  assignee: { type: Schema.ObjectId, ref: 'user' },
  assignor: { type: Schema.ObjectId, ref: 'user' },
  transactionStatus: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.APPROVED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.DENIED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.COMPLETED
    ]
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("transaction", transaction);