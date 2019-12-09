var nodemailer = require('nodemailer');
var hbs = require('handlebars');
var EmailTemplate = require('../lib/otpVerificationTemplate')
var transporter = nodemailer.createTransport({
  pool: true,
  port: 587,
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

var template = hbs.compile(EmailTemplate.htmlPage);

var mailOptions = {
  from: '' + process.env.APP_NAME + '<' + process.env.NODEMAILER_USER + '>',
  to: '',
  subject: 'OTP Verification : DO NOT REPLY',
  html: EmailTemplate.htmlPage
};

var sendMail = function (to, OTP) {
  mailOptions.to = to;
  mailOptions.html = template({ OTP });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendMail: sendMail
}

