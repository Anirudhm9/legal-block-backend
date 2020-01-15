/**
 * Created by Navit
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var admin = new Schema({
    emailId: { type: String, unique: true, sparse: true },
    fullName: { type: String },
    password: { type: String, required: true },
    accessToken: { type: String, select: false },
    userType: {
        type: String, enum: [
            Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN,
            Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
        ]
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        index: true,
        min: 5,
        max: 15
    },
    countryCode: { type: String },
    initialPassword: { type: String },
    password: { type: String },
    OTPCode: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    firstLogin: { type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    isBlocked: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model('admin', admin);