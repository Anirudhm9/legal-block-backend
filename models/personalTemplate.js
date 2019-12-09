var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var personalTemplate = new Schema({
    userId: { type: Schema.ObjectId, ref: 'user' },
    templateName: { type: String, trim: true, required: true },
    content: { type: String, trim: true, required: true },
});

module.exports = mongoose.model("personalTemplate", personalTemplate);