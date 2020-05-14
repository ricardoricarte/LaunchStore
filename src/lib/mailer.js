const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({ //config padrão (mailtrap)
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b1e66cb9b68a46",
    pass: "b32afd6536a143"
  }
});
