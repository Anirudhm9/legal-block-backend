var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require("../config");

var contracts = new Schema({
    contractName: { type: String, trim: true, required: true },
    clientName: { type: String, trim: true, required: true },
    contractType: { type: String, trim: true, required: true },
    userId: { type: Schema.ObjectId, ref: 'user' },
    content: { type: String, trim: true, required: true },
    dateAssigned: { type: Date, default: Date.now },
});

module.exports = mongoose.model("contracts", contracts);