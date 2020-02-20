var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var contracts = new Schema({
  contractName: { type: String, trim: true, required: true },
  contractType: { type: String, trim: true, required: true },
  assignor: { type: Schema.ObjectId, ref: 'user' },
  assignees: [
    { type: Schema.ObjectId, ref: 'user' }
  ],
  contractStatus: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.PROCESSING,
      Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.COMPLETED,
      Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED,
      Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.INITIATED,
      Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.TERMINATED
    ]
  },
  critical: { type: Boolean, default: false },
  assigneesSigned: [
    { type: Schema.ObjectId, ref: 'user' }
  ],
  content: { type: String, trim: true, required: true },
  dateAssigned: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model("contracts", contracts);