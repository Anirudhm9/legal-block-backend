/**
 * Created by Navit
 */
"use strict";

var DemoBaseRoute = require("./demoRoute/demoBaseRoute");
var UserBaseRoute = require("./userRoute/userBaseRoute");
var AdminBaseRoute = require("./adminRoute/adminBaseRoute");
var TemplateBaseRoute = require("./templateLibraryRoute/templateLibraryBaseRoute");
var ContractBaseRoute = require("./contractRoute/contractBaseRoute");
var RequestBaseRoute = require("./requestRoute/requestBaseRoute");
var ActionBaseRoute = require("./actionRoute/actionBaseRoute");
var APIs = [].concat(DemoBaseRoute, UserBaseRoute, AdminBaseRoute, TemplateBaseRoute, ContractBaseRoute, RequestBaseRoute, ActionBaseRoute);
module.exports = APIs;
