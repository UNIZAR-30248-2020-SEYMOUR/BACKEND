const nodemailer = require('nodemailer');


/**
 * Initialize nodemailer (values)
 *
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.seymour@gmail.com',
        pass: 'SSHSeymour1.'
    }
});

/**
 * Call nodemailer and send Emilio with
 * given data
 *
 * @param mailOptions
 */

function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, function () {
        if (error) {
            console.log(error);
        } else {
            console.log('Emilio sent:');
        }
    });
}

exports.sendEmail = sendEmail;