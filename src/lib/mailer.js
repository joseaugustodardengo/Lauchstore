const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5a4b2200c913ab",
      pass: "babec91a8284cd"
    }
  });  