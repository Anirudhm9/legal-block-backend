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
      Config.APP_CONSTANTS.DATABASE.CONTRACT_STATUS.DENIED
    ]
  },
  content: { type: String, trim: true, required: true },
  dateAssigned: { type: Date, default: Date.now },
});

module.exports = mongoose.model("contracts", contracts);