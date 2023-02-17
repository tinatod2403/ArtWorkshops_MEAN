import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import user from '../models/user';
import Admin from '../models/Admin';
import workshop from '../models/workshop';

export class AdminController {


    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        Admin.findOne({ 'username': username, 'password': password }, (error, admin) => {

            if
                (error) console.log(error);
            else
                res.json(admin);
        })
    }


    getRegistrationRequests = (req: express.Request, res: express.Response) => {

        user.find({ status: "pending" }, (err, request) => {
            if (err) console.log(err)
            else res.json(request)
        })
    }



    getWorkshopPropositions = (req: express.Request, res: express.Response) => {
        // console.log("getWorkshopPropositions")

        workshop.find({ status: "pending", date: { $gt: new Date() } }, (err, propositions) => {
            if (err) console.log(err)
            else res.json(propositions)
        })

    }

    getAllUsers = (req: express.Request, res: express.Response) => {


        user.find({ isOrganizer: false }, (err, users) => {
            if (err) console.log(err)
            else {
                console.log(users)
                res.json(users)
            }
        })

    }

    getAllOrganizers = (req: express.Request, res: express.Response) => {


        user.find({ isOrganizer: true }, (err, organizers) => {
            if (err) console.log(err)
            else {
                res.json(organizers)
            }
        })

    }


    getAllWorkshops = (req: express.Request, res: express.Response) => {


        workshop.find({}, (err, workshops) => {
            if (err) console.log(err)
            else {
                res.json(workshops)
            }
        })

    }


    sendMail = (req: express.Request, res: express.Response) => {

        const nodemailer = require('nodemailer');

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'artworkshop23@outlook.com',
                pass: 'organizer123'
            }
        });

        let mailOptions = {
            from: '"Admin" <artworkshop23@outlook.com>', // sender address
            to: 'kristinatodorovic2403@gmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<h1>FILIP MAGARAC</h1>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Mail OK")
                res.json({ "resp": "OK" })
            }
        }
        );

    }
}