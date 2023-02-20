import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import user from '../models/user';
import Admin from '../models/Admin';
import workshop from '../models/workshop';
import { ObjectId } from 'mongodb';
import Comment from '../models/Comment';
import Like from '../models/Like';
import Message from '../models/Message';
import Waitlist from '../models/Waitlist';
import signUp from '../models/signUp';

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
                // console.log(users)
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

    updateStatus = (req: express.Request, res: express.Response) => {


        user.updateOne({ username: req.body.username }, { $set: { status: req.body.value } },
            (err, resp) => {
                if (err) console.log(err)
                else res.json({ 'resp': "OK" })
            })

    }

    approveWorkshop = (req: express.Request, res: express.Response) => {


        workshop.updateOne({ _id: new ObjectId(req.body.id) }, { $set: { status: 'accepted' } },
            (err, resp) => {
                if (err) console.log(err)
                else res.json({ 'resp': "OK" })
            })

    }

    changePassword = (req: express.Request, res: express.Response) => {
        // console.log(req.body.username)
        // console.log(req.body.newPass)

        Admin.updateOne({ username: req.body.username }, { $set: { password: req.body.newPass } },
            (err, resp) => {
                if (err) console.log(err)
                else res.json({ 'resp': "OK" })
            })

    }

    deleteUser = (req: express.Request, res: express.Response) => {
        let u = req.body.user


        Comment.deleteMany({ 'sender.username': u.username }, (err, resp) => {
            if (err) console.log(err)
        })
        Like.deleteMany({ 'user.username': u.username }, (err, resp) => {
            if (err) console.log(err)
        })
        Message.deleteMany(
            {
                $or: [
                    { 'sender.username': u.username },
                    { 'recipient.username': u.username }]
            },
            (err, resp) => {
                if (err) console.log(err)
            })

        Waitlist.deleteOne({ 'user.username': u.username }, (err, resp) => {
            if (err) console.log(err)
        })

        signUp.find({ 'username': u.username, 'status': 'accepted' }, (err, signups) => {
            if (err) console.log(err)
            else {

                let ids: ObjectId[] = [];
                signups.forEach(s => {
                    ids.push(new ObjectId(s.idWorkshop))
                })
                console.log(ids)
                workshop.updateMany({ '_id': { $in: ids } }, { $inc: { bookedPlaces: -1 } }, (err, resp) => {
                    if (err) console.log(err)
                })

                signUp.deleteMany({ 'username': u.username }, (err, resp) => {
                    if (err) console.log(err)
                })
            }
        })

        user.deleteOne({ username: u.username }, (err, resp) => {
            if (err) console.log(err)
            else {
                user.find({ isOrganizer: false }, (err, users) => {
                    if (err) console.log(err)
                    else res.json(users)
                })
            }
        })

    }

    deleteOrganizer = (req: express.Request, res: express.Response) => {
        let organizer = req.body.organizer

        Message.deleteMany({
            $or: [
                { 'sender.username': organizer.username },
                { 'recipient.username': organizer.username }
            ]
        }, (err, resp) => {
            if (err) console.log(err)
        })

        console.log(organizer.username)
        Like.deleteMany({ 'workshop.organizer': organizer.username }, (err, resp) => {
            if (err) console.log(err)
        })

        Comment.deleteMany({ 'workshop.organizer': organizer.username }, (err, resp) => {
            if (err) console.log(err)
        })

        signUp.deleteMany({ 'organizer': organizer.username }, (err, resp) => {
            if (err) console.log(err)
        })

        workshop.deleteMany({ organizer: organizer.username }, (err, resp) => {
            if (err) console.log(err)
        })


        user.deleteOne({ username: organizer.username }, (err, resp) => {
            if (err) console.log(err)
            else {
                user.find({ isOrganizer: true }, (err, org) => {
                    if (err) console.log(err)
                    else res.json(org)
                })
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