var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var action = new Schema({
  actionName: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.COMPLAIN,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.MAINTENANCE,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.QUERY,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.RESPOND,
      Config.APP_CONSTANTS.DATABASE.ACTION_TYPE.TERMINATE
    ]
  },
  contractType: { type: String, trim: true, required: true },
  userType: [{
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNOR,
      Config.APP_CONSTANTS.DATABASE.USER_TYPE.ASSIGNEE,
    ]
  }],
  active: { type: Boolean, default: true },
  keysRequired: [
    {
      name: { type: String, trim: true },
      type: { type: String, trim: true }
    }
  ],
  rules: {
    type: String, enum: [
      Config.APP_CONSTANTS.DATABASE.RULES.CALCULATEFINE,
      Config.APP_CONSTANTS.DATABASE.RULES.CHECKEXPIRY,
      Config.APP_CONSTANTS.DATABASE.RULES.CHECKINTERVAL,
    ]
  }
});

module.exports = mongoose.model("action", action);