var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var action = new Schema({
  actionName: { type: String, trim: true, required: true },
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
  ]
});

module.exports = mongoose.model("action", action);