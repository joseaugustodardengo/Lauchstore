const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9ba7533dbf3902",
      pass: "d55a5df3dd3cb8"
    }
  });  