"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailController = void 0;
class MailController {
    constructor() {
        this.sendMail = (req, res) => {
            const nodemailer = require('nodemailer');
            console.log("tu");
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'artworksho23@gmail.com',
                    pass: 'admin123*'
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Admin" <artworksho23@gmail.com>',
                to: 'kristinatodorovic2403@gmail.com',
                subject: 'Hello ✔',
                text: 'Hello world?',
                html: '<b>Hello world?</b>' // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("ok");
                    res.json({ "resp": "OK" });
                }
            });
        };
    }
}
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map