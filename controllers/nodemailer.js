const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fullstackhacktiv8@gmail.com",
    pass: "nuipnabgtkvxjkup",
  },
});

function nodeMailer(email) {
  let mailOptions = {
    from: "fullstackhacktiv8@gmail.com",
    to: email,
    subject: "Registration",
    text: "Your registration is success.",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    console.log("Email sent: " + info.response);
  });
}

module.exports = nodeMailer;
