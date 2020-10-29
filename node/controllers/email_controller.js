var nodemailer = require('nodemailer');


/**
 * Initialize nodemailer (values)
 *
 */
var transporter = nodemailer.createTransport({
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
    console.log("Envio mail.")
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Emilio sent: ' + info.response);
        }
    });
}

exports.sendEmail = sendEmail;