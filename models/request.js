var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var request = new Schema({
  requestName: { type: String, trim: true, required: true },
  requestType: { type: String, trim: true, required: true },
  contractId: { type: Schema.ObjectId, ref: 'contracts' },
  requestor: { type: Schema.ObjectId, ref: 'user' },
  respondent: [{ type: Schema.ObjectId, ref: 'user' }],
  requestStatus: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.CREATED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.APPROVED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.PROCESSING,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.DENIED,
      Config.APP_CONSTANTS.DATABASE.TRANSACTION_STATUS.COMPLETED
    ]
  },
  response: [
    {
      user: {
        type: String, enum: [
          Config.APP_CONSTANTS.DATABASE.REQUEST_USER_TYPE.REQUESTOR,
          Config.APP_CONSTANTS.DATABASE.REQUEST_USER_TYPE.RESPONDENT
        ]
      },
      message: { type: String, trim: true, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  dateRequested: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model("request", request);