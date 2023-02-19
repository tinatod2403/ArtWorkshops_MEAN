import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import { ParsedQs } from 'qs';
import user from '../models/user';
import Message from '../models/Message';
import signUp from '../models/signUp';
import Workshop from '../models/workshop';
import path from 'path';
import Like from '../models/Like';
import Comment from '../models/Comment';

export class OrganizerController {

    addWorkshop = (req: express.Request, res: express.Response) => {
        let workshop = new Workshop({
            name: req.body.name,
            date: req.body.date,
            place: req.body.place,
            shortDesc: req.body.shortDesc,
            longDesc: req.body.longDesc,
            mainPhoto: req.body.mainPhoto,
            gallery: req.body.gallery,
            numOfPlaces: req.body.numOfPlaces,
            organizer: req.body.organizer,
            status: req.body.status,
            _id: new ObjectId()

        })
        console.log("broj ", req.body.numOfPlaces)

        workshop.save().then(user => {
            res.status(200).json({ 'resp': 'OK' });
        }).catch(err => {
            res.status(400).json({ 'resp': 'error' })
        })


    }

    getMyWorkshops = (req: express.Request, res: express.Response) => {
        let organizer = req.body.organizer

        Workshop.find({ organizer: organizer }, (error, workshops) => {

            if
                (error) console.log(error);
            else {
                // console.log("ima li ih: ", workshops);
                res.json(workshops);
            }

        })
    }

    workshopDetails = (req: express.Request, res: express.Response) => {
        let id = new ObjectId(req.body.id)

        Workshop.findOne({ _id: id }, (error, workshop) => {
            if
                (error) console.log(error);
            else {
                res.json(workshop);
            }
        })

    }



    editWorkshopDetailes = (req: express.Request, res: express.Response) => {

        let newDataValue = req.body.newDataValue;
        let dataName = req.body.dataName;

        Workshop.updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: { [dataName]: newDataValue } }, (error, success) => {
                if (error) {
                    console.log(error);
                }
                else {
                    if (dataName == "name")
                        signUp.updateMany(
                            { idWorkshop: req.body._id },
                            { $set: { 'nameWorkshop': newDataValue } }, (error, success) => {
                                if (error)
                                    console.log(error);
                                else
                                    res.json({ "resp": "OK" })

                            }
                        );
                    else if (dataName == "date") {
                        signUp.updateMany(
                            { idWorkshop: req.body._id },
                            { $set: { 'workshopDate': new Date(newDataValue) } }, (error, success) => {
                                if (error)
                                    console.log(error);
                            }
                        );
                        // signUp.updateMany(
                        //     { idWorkshop: req.body._id },
                        //     { $set: { 'workshopDate': new Date(newDataValue) } }, (error, success) => {
                        //         if (error)
                        //             console.log(error);
                        //         else
                        //             res.json({ "resp": "OK" })

                        //     }
                        // );
                    }
                    else if (dataName == "mainPhoto") {
                        signUp.updateMany(
                            { idWorkshop: req.body._id },
                            { $set: { 'workshopPicture': newDataValue } }, (error, success) => {
                                if (error)
                                    console.log(error);
                            }
                        );
                        Like.updateMany(
                            { 'workshop._id': req.body._id },
                            { $set: { 'workshop.mainPhoto': newDataValue } }, (error, success) => {
                                if (error)
                                    console.log(error);
                            }
                        );
                        Comment.updateMany(
                            { 'workshop._id': req.body._id },
                            { $set: { 'workshop.mainPhoto': newDataValue } }, (error, success) => {
                                if (error)
                                    console.log(error);
                            }
                        );
                    }


                }
            }
        );
    }

    getSignUpRequests = (req: express.Request, res: express.Response) => {//dobro za dodavanje i bivsih ucesnika

        let organizer = req.body.organizer;
        let today = new Date();

        signUp.find({ workshopDate: { $gt: today }, organizer: organizer }, (error, signUps) => {

            if (signUps)
                res.json(signUps)
            else
                console.log(error)
        })
    }

    acceptRequestForWorkshop = (req: express.Request, res: express.Response) => {

        signUp.updateOne(
            {
                username: req.body.username,
                idWorkshop: req.body.idWorkshop
            }, { $set: { status: 'accepted' } }, (error, success) => {
                if
                    (error) console.log(error)
                else
                    res.json({ "resp": "OK" })
            })
    }

    getMessageRequests = (req: express.Request, res: express.Response) => {

        Message.aggregate([
            {
                $match: {
                    'workshop._id': req.body.workshopId,
                    'recipient.username': req.body.recipientUsername
                }
            },
            {
                $group: {
                    _id: '$sender.username',
                    senderUsername: { $first: '$sender.username' },
                    senderPicture: { $first: '$sender.picture' }
                }
            }
        ], (err, messageRequests) => {
            if (err) console.log(err)
            else res.json(messageRequests)
        });

    }



    getMessages = (req: express.Request, res: express.Response) => {
        // console.log("ID ", req.body.workshopId)
        Message.find({
            'workshop._id': req.body.workshopId,
            $or: [
                { 'sender.username': req.body.senderUsername, 'recipient.username': req.body.recipientUsername },
                { 'sender.username': req.body.recipientUsername, 'recipient.username': req.body.senderUsername }
            ]
        }
        ).sort({ timestamp: 1 }).then(messages => {
            if (messages) {
                res.json(messages)
            }
        })

    }


    sendMessage = (req: express.Request, res: express.Response) => {

        // console.log("sendMessage")

        let message = new Message({
            workshop: req.body.workshop,
            sender: req.body.sender,
            recipient: req.body.recipient,
            content: req.body.content,
            timestamp: req.body.timestamp
        })

        message.save().then(message => {
            if (message) {
                res.json({ "resp": "OK" })
            }
        })

    }

    saveAsTemplate = (req: express.Request, res: express.Response) => {
        let workshop = req.body.workshop;

        const fs = require('fs');
        let templateData = JSON.stringify(workshop);
        let directoryPath = 'templatesWorkshop/' + workshop.organizer;
        const workshopName = workshop.name.replace(/\s+/g, "_");
        const filePath = path.join(directoryPath, workshopName + ".json");

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        fs.writeFile(filePath, templateData, (err) => {
            if (err) throw err;
            else {
                res.json({ "resp": "OK" })
            }
        });



    }

    getNamesOfTemplates = (req: express.Request, res: express.Response) => {
        const fs = require('fs');
        let organizer = req.body.organizer;

        fs.readdir('templatesWorkshop/' + organizer, (err, files) => {
            if (err) {
                console.error(err);
                return;
            }
            else {
                res.json(files)
            }

        });
    }

    getTemplateData = (req: express.Request, res: express.Response) => {
        const fs = require('fs');
        fs.readFile('templatesWorkshop/' + req.body.organizer + '/' + req.body.templateName,
            (err, data) => {
                if (err) throw err;
                const myObject = JSON.parse(data);
                res.json(myObject)
            });
    }





    cancelWorkshop = (req: express.Request, res: express.Response) => {
        let wName;
        let wOrganizer;
        let wPhoto;
        signUp.find({ idWorkshop: req.body.workshopId }, (err, signup) => {
            if (err) console.log(err)
            else {
                let usernames = [];
                signup.forEach(s => {
                    usernames.push(s.username)
                })
                user.find({ username: { $in: usernames } }, (err, users) => {
                    if (err) console.log(err)
                    else {
                        let emails = [];
                        users.forEach(u => {
                            emails.push(u.email)
                        })

                        if (signup) {
                            wName = signup[0].nameWorkshop
                            wOrganizer = signup[0].organizer
                            wPhoto = signup[0].workshopPicture
                        }
                        /////////////////////////////////////////////////////////////////////////////////
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
                            from: '"' + wOrganizer + '" <artworkshop23@outlook.com>', // sender address
                            to: emails, // list of receivers
                            subject: '❌Cancellation❌', // Subject line
                            text: 'Cancellation', // plain text body
                            html: '<h1 style="text-align: center; color: red;">Cancellation of the workshop <strong>' + wName + '</strong></h1><p style="color: red; font-weight: bold;">CAUTION:</p><p">This workshop has been canceled by the organizer.</p>' // html body
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

                        ////////////////////////////////////////////////////////////////////////////////


                    }
                })
            }
        })





    }

}