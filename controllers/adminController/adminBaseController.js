/**
 * Created by Navit on 15/11/16.
 */
var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var Config = require("../../config");
var NodeMailer = require('../../lib/nodeMailer');

var adminLogin = function (payloadData, callback) {
  payloadData.emailId = payloadData.emailId.toLowerCase();
  var userFound = false;
  var accessToken = null;
  var successLogin = false;
  async.series(
    [
      function (cb) {
        //verify email address
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
          cb(ERROR.INVALID_EMAIL_FORMAT);
        } else {
          cb();
        }
      },
      function (cb) {
        var criteria = {
          emailId: payloadData.emailId
        };

        var option = {
          lean: true
        };
        Service.AdminService.getAdmin(criteria, {}, option, function (
          err,
          result
        ) {
          if (err) {
            cb(err);
          } else {
            userFound = (result && result[0]) || null;
            cb();
          }
        });
      },
      function (cb) {
        //validations
        if (!userFound) {
          cb(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .EMAIL_NOT_FOUND
          );
        } else {
          if (
            userFound &&
            userFound.password !=
            UniversalFunctions.CryptData(payloadData.password)
          ) {
            cb(ERROR.INCORRECT_PASSWORD);
          } else if (userFound.isBlocked == true) {
            cb(ERROR.ACCOUNT_BLOCKED);
          } else {
            successLogin = true;
            cb();
          }
        }
      },
      function (cb) {
        var criteria = {
          emailId: payloadData.emailId
        };
        var projection = {
          password: 0
        };
        var option = {
          lean: true
        };
        Service.AdminService.getAdmin(criteria, projection, option, function (
          err,
          result
        ) {
          if (err) {
            cb(err);
          } else {
            userFound = (result && result[0]) || null;
            cb();
          }
        });
      },
      function (cb) {
        if (successLogin) {
          var tokenData = {
            id: userFound._id,
            type:
              UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
          };
          TokenManager.setToken(tokenData, function (err, output) {
            if (err) {
              cb(err);
            } else {
              if (output && output.accessToken) {
                accessToken = output && output.accessToken;
                cb();
              } else {
                cb(error.IMP_ERROR);
              }
            }
          });
        } else {
          cb(error.IMP_ERROR);
        }
      }
    ],
    function (err, data) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, {
          accessToken: accessToken,
          adminDetails: userFound
        });
      }
    }
  );
};

var accessTokenLogin = function (userData, callback) {
  var appVersion;
  var userdata = {};
  var userFound = null;
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData._id
        };
        Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (
          err,
          data
        ) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              userFound = (data && data[0]) || null;
              cb();
            }
          }
        });
      },
      function (cb) {
        appVersion = {
          latestIOSVersion: 100,
          latestAndroidVersion: 100,
          criticalAndroidVersion: 100,
          criticalIOSVersion: 100
        };
        cb(null);
      }
    ],
    function (err, user) {
      if (!err)
        return callback(null, {
          accessToken: userdata.accessToken,
          adminDetails: UniversalFunctions.deleteUnnecessaryUserData(userFound),
          appVersion: appVersion
        });
      else callback(err);
    }
  );
};

var registerAdmin = function (payloadData, callback) {
  var accessToken = null;
  var uniqueCode = null;
  var dataToSave = payloadData;
  if (dataToSave.password)
    dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
  var customerData = null;
  var appVersion = null;
  async.series(
    [
      function (cb) {
        var query = {
          $or: [{ emailId: payloadData.emailId }]
        };
        Service.AdminService.getAdmin(query, {}, { lean: true }, function (
          error,
          data
        ) {
          if (error) {
            cb(error);
          } else {
            if (data && data.length > 0) {
              if (data[0].emailVerified == true) {
                cb(ERROR.USER_ALREADY_REGISTERED);
              } else {
                Service.UserService.deleteUser({ _id: data[0]._id }, function (
                  err,
                  updatedData
                ) {
                  if (err) cb(err);
                  else cb(null);
                });
              }
            } else {
              cb(null);
            }
          }
        });
      },
      function (cb) {
        //Validate for facebookId and password
        if (!dataToSave.password) {
          cb(ERROR.PASSWORD_REQUIRED);
        } else {
          cb();
        }
      },
      function (cb) {
        //Validate countryCode
        if (dataToSave.countryCode.lastIndexOf("+") == 0) {
          if (!isFinite(dataToSave.countryCode.substr(1))) {
            cb(ERROR.INVALID_COUNTRY_CODE);
          } else {
            cb();
          }
        } else {
          cb(ERROR.INVALID_COUNTRY_CODE);
        }
      },
      function (cb) {
        //Validate phone No
        if (
          dataToSave.phoneNumber &&
          dataToSave.phoneNumber.split("")[0] == 0
        ) {
          cb(ERROR.INVALID_PHONE_NO_FORMAT);
        } else {

          cb();
        }
      },
      function (cb) {
        CodeGenerator.generateUniqueCode(
          6,
          UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN,
          function (err, numberObj) {
            if (err) {
              cb(err);
            } else {
              if (!numberObj || numberObj.number == null) {
                cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
              } else {
                uniqueCode = numberObj.number;
                cb();
              }
            }
          }
        );
      },
      function (cb) {
        //Insert Into DB
        dataToSave.OTPCode = uniqueCode;
        dataToSave.registrationDate = new Date().toISOString();
        dataToSave.firstLogin = true;
        dataToSave.userType = Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN;
        Service.AdminService.createAdmin(dataToSave, function (
          err,
          customerDataFromDB
        ) {
          if (err) {
            if (err.code == 11000 && err.message.indexOf("emailId_1") > -1) {
              cb(ERROR.EMAIL_NO_EXIST);
            } else {
              cb(err);
            }
          } else {
            customerData = customerDataFromDB;
            NodeMailer.sendMail(payloadData.emailId, uniqueCode);
            cb();
          }
        });
      },
      // function (cb) {
      //     //Send SMS to User
      //     if (customerData) {
      //         NotificationManager.sendSMSToUser(uniqueCode, dataToSave.countryCode, dataToSave.mobileNo, function (err, data) {
      //             cb();
      //         })
      //     } else {
      //         cb(ERROR.IMP_ERROR)
      //     }
      //
      // },
      function (cb) {
        console.log(">>>>", customerData)
        //Set Access Token
        if (customerData) {
          var tokenData = {
            id: customerData._id,
            type:
              UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
          };
          TokenManager.setToken(tokenData, function (err, output) {
            if (err) {
              cb(err);
            } else {
              accessToken = (output && output.accessToken) || null;
              cb();
            }
          });
        } else {
          console.log(">>", customerData)
          cb(ERROR.IMP_ERROR);
        }
      },
      function (cb) {
        appVersion = {
          latestIOSVersion: 100,
          latestAndroidVersion: 100,
          criticalAndroidVersion: 100,
          criticalIOSVersion: 100
        };
        cb(null);
      }
    ],
    function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          accessToken: accessToken,
          otpCode: customerData.OTPCode,
          adminDetails: UniversalFunctions.deleteUnnecessaryUserData(
            customerData
          ),
          appVersion: appVersion
        });
      }
    }
  );
};

var verifyOTP = function (userData, payloadData, callback) {
  var customerData;
  async.series(
    [
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = { lean: true };
        Service.AdminService.getAdmin(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              customerData = (data && data[0]) || null;
              cb();
            }
          }
        });
      },
      function (cb) {
        //Check verification code :
        if (payloadData.OTPCode == customerData.OTPCode) {
          cb();
        } else {
          cb(ERROR.INVALID_CODE);
        }
      },
      function (cb) {
        //trying to update customer
        var criteria = {
          _id: userData._id,
          OTPCode: payloadData.OTPCode
        };
        var setQuery = {
          $set: { emailVerified: true },
          $unset: { OTPCode: 1 }
        };
        var options = { new: true };
        Service.AdminService.updateAdmin(criteria, setQuery, options, function (
          err,
          updatedData
        ) {
          if (err) {
            cb(err);
          } else {
            if (!updatedData) {
              cb(ERROR.INVALID_CODE);
            } else {
              cb();
            }
          }
        });
      }
    ],
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    }
  );
};

var createAdmin = function (userData, payloadData, callback) {
  var newAdmin;
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData._id
        };
        Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              userFound = (data && data[0]) || null;
              if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);
              else cb();
            }
          }
        });
      },
      function (cb) {
        var criteria = {
          emailId: payloadData.emailId
        }
        Service.AdminService.getAdmin(criteria, {}, {}, function (err, data) {
          if (err) cb(err)
          else {
            if (data.length > 0) cb(ERROR.USERNAME_EXIST)
            else cb()
          }
        })
      },
      function (cb) {
        payloadData.initialPassword = UniversalFunctions.generateRandomString();
        payloadData.password = UniversalFunctions.CryptData(payloadData.initialPassword);
        payloadData.userType = Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN;
        Service.AdminService.createAdmin(payloadData, function (err, data) {
          if (err) cb(err)
          else {
            newAdmin = data;
            NodeMailer.sendAccountMail(payloadData.emailId, payloadData.initialPassword);
            cb()
          }
        })
      }
    ],
    function (err, result) {
      if (err) return callback(err);
      else return callback(null, { adminDetails: UniversalFunctions.deleteUnnecessaryUserData(newAdmin) });
    }
  );
};

var getAdmin = function (userData, callback) {
  var adminList = []
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);
            else cb();
          }
        }
      });
    },
    function (cb) {
      Service.AdminService.getAdmin({
        userType: Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
      }, { password: 0, __v: 0, createdAt: 0 }, {}, function (err, data) {
        if (err) cb(err)
        else {
          adminList = data;
          cb()
        }
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: adminList })
  })
}

var blockUnblockAdmin = function (userData, payloadData, callback) {
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);
            else cb();
          }
        }
      });
    },
    function (cb) {
      Service.AdminService.getAdmin({ _id: payloadData.adminId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) cb(ERROR.USER_NOT_FOUND)
          else cb()
        }
      })
    },
    function (cb) {
      var criteria = {
        _id: payloadData.adminId
      }
      var dataToUpdate = {
        $set: {
          isBlocked: payloadData.block
        }
      }
      Service.AdminService.updateAdmin(criteria, dataToUpdate, {}, function (err, data) {
        if (err) cb(err)
        else cb()
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null)
  })
}

var createUser = function (userData, payloadData, callback) {
  var newUserData;
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            cb()
          }
        }
      });
    },
    function (cb) {
      Service.UserService.getUser({ emailId: payloadData.emailId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length != 0) cb(ERROR.USER_ALREADY_REGISTERED)
          else cb()
        }
      })
    },
    function (cb) {
      payloadData.initialPassword = UniversalFunctions.generateRandomString();
      payloadData.password = UniversalFunctions.CryptData(payloadData.initialPassword);
      payloadData.emailVerified = true;
      Service.UserService.createUser(payloadData, function (err, data) {
        if (err) cb(err)
        else {
          newUserData = data;
          NodeMailer.sendAccountMail(payloadData.emailId, payloadData.initialPassword);
          cb()
        }
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { userData: UniversalFunctions.deleteUnnecessaryUserData(newUserData) })
  })
}

var getUser = function (userData, callback) {
  var userList = []
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED)
            else cb()
          }
        }
      });
    },
    function (cb) {
      var projection = {
        password: 0,
        accessToken: 0,
        OTPCode: 0,
        code: 0,
        codeUpdatedAt: 0,
        __v: 0,
        registrationDate: 0
      }
      Service.UserService.getUser({}, projection, {}, function (err, data) {
        if (err) cb(err)
        else {
          userList = data;
          cb()
        }
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: userList })
  })
}

var blockUnblockUser = function (userData, payloadData, callback) {
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getAdmin(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED)
            else cb()
          }
        }
      });
    },
    function (cb) {
      Service.UserService.getUser({ _id: payloadData.userId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) cb(ERROR.USER_NOT_FOUND)
          else cb()
        }
      })
    },
    function (cb) {
      var criteria = {
        _id: payloadData.userId
      }
      var dataToUpdate = {
        $set: {
          isBlocked: payloadData.block
        }
      }
      Service.UserService.updateUser(criteria, dataToUpdate, {}, function (err, data) {
        if (err) cb(err)
        else cb()
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null)
  })
}

var changePassword = function (userData, payloadData, callbackRoute) {
  var oldPassword = UniversalFunctions.CryptData(payloadData.oldPassword);
  var newPassword = UniversalFunctions.CryptData(payloadData.newPassword);
  var customerData;
  async.series(
    [
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = { lean: true };
        Service.AdminService.getAdmin(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              customerData = (data && data[0]) || null;
              if (customerData.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);
              else cb();
            }
          }
        });
      },
      function (callback) {
        var query = {
          _id: userData._id
        };
        var projection = {
          password: 1,
          firstLogin: 1
        };
        var options = { lean: true };
        Service.AdminService.getAdmin(query, projection, options, function (
          err,
          data
        ) {
          if (err) {
            callback(err);
          } else {
            customerData = (data && data[0]) || null;
            if (customerData == null) {
              callback(ERROR.NOT_FOUND);
            } else {
              if (payloadData.skip == false) {
                if (
                  data[0].password == oldPassword &&
                  data[0].password != newPassword
                ) {
                  callback(null);
                } else if (data[0].password != oldPassword) {
                  callback(ERROR.WRONG_PASSWORD);
                } else if (data[0].password == newPassword) {
                  callback(ERROR.NOT_UPDATE);
                }
              }
              else callback(null)
            }
          }
        });
      },
      function (callback) {
        var dataToUpdate;
        if (payloadData.skip == true && customerData.firstLogin == false) {
          dataToUpdate = { $set: { firstLogin: true }, $unset: { initialPassword: 1 } };
        }
        else if (payloadData.skip == false && customerData.firstLogin == false) {
          dataToUpdate = { $set: { password: newPassword, firstLogin: true }, $unset: { initialPassword: 1 } };
        }
        else {
          dataToUpdate = { $set: { password: newPassword } };
        }
        var condition = { _id: userData._id };
        Service.AdminService.updateAdmin(condition, dataToUpdate, {}, function (
          err,
          user
        ) {
          if (err) {
            callback(err);
          } else {
            if (!user || user.length == 0) {
              callback(ERROR.NOT_FOUND);
            } else {
              callback(null);
            }
          }
        });
      }
    ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null);
      }
    }
  );
}

var logoutAdmin = function (userData, callbackRoute) {
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData._id
        };
        Service.AdminService.getAdmin(criteria, {}, {}, function (err, data) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              cb();
            }
          }
        });
      },
      function (callback) {
        var condition = { _id: userData._id };
        var dataToUpdate = { $unset: { accessToken: 1 } };
        Service.AdminService.updateAdmin(condition, dataToUpdate, {}, function (
          err,
          result
        ) {
          if (err) {
            callback(err);
          } else {
            callback();
          }
        });
      }
    ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null);
      }
    }
  );
}

module.exports = {
  adminLogin: adminLogin,
  accessTokenLogin: accessTokenLogin,
  createAdmin: createAdmin,
  getAdmin: getAdmin,
  blockUnblockAdmin: blockUnblockAdmin,
  createUser: createUser,
  getUser: getUser,
  blockUnblockUser: blockUnblockUser,
  changePassword: changePassword,
  logoutAdmin: logoutAdmin,
  registerAdmin: registerAdmin,
  verifyOTP: verifyOTP
};