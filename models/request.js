var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var request = new Schema({
  requestType: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.COMPLAIN,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.MAINTENANCE,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.QUERY,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.RESPOND,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.TERMINATE
    ]
  },
  contractId: { type: Schema.ObjectId, ref: 'contracts' },
  requestor: { type: Schema.ObjectId, ref: 'user' },
  respondent: [{ type: Schema.ObjectId, ref: 'user' }],
  requestInfo: { type: Object },
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