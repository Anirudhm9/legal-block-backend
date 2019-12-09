var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var templateLibrary = new Schema({
  templateName: { type: String, trim: true, required: true },
  templateType: { type: String, trim: true, required: true },
  content: { type: String, trim: true, required: true },
});

module.exports = mongoose.model("templateLibrary", templateLibrary);