const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cc959135f92c7c",
      pass: "46f776a09b298d"
    }
  });  