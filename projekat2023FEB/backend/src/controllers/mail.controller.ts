import * as express from 'express';


export class MailController {


    sendMail = (req: express.Request, res: express.Response) => {
        const nodemailer = require('nodemailer');

        console.log("tu")

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
            from: '"Admin" <artworksho23@gmail.com>', // sender address
            to: 'kristinatodorovic2403@gmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("ok")
                res.json({ "resp": "OK" })
            }
        }
        );

    }
}





