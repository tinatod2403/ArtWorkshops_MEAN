"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerController = void 0;
const mongodb_1 = require("mongodb");
const user_1 = __importDefault(require("../models/user"));
const Message_1 = __importDefault(require("../models/Message"));
const signUp_1 = __importDefault(require("../models/signUp"));
const workshop_1 = __importDefault(require("../models/workshop"));
const path_1 = __importDefault(require("path"));
const Like_1 = __importDefault(require("../models/Like"));
const Comment_1 = __importDefault(require("../models/Comment"));
class OrganizerController {
    constructor() {
        this.addWorkshop = (req, res) => {
            let workshop = new workshop_1.default({
                name: req.body.name,
                date: req.body.date,
                place: req.body.place,
                shortDesc: req.body.shortDesc,
                longDesc: req.body.longDesc,
                mainPhoto: req.body.mainPhoto,
                gallery: req.body.gallery,
                numOfPlaces: req.body.numOfPlaces,
                bookedPlaces: 0,
                organizer: req.body.organizer,
                status: req.body.status,
                _id: new mongodb_1.ObjectId()
            });
            console.log("broj ", req.body.numOfPlaces);
            workshop.save().then(user => {
                res.status(200).json({ 'resp': 'OK' });
            }).catch(err => {
                res.status(400).json({ 'resp': 'error' });
            });
        };
        this.getMyWorkshops = (req, res) => {
            let organizer = req.body.organizer;
            workshop_1.default.find({ organizer: organizer }, (error, workshops) => {
                if (error)
                    console.log(error);
                else {
                    // console.log("ima li ih: ", workshops);
                    res.json(workshops);
                }
            });
        };
        this.workshopDetails = (req, res) => {
            let id = new mongodb_1.ObjectId(req.body.id);
            workshop_1.default.findOne({ _id: id }, (error, workshop) => {
                if (error)
                    console.log(error);
                else {
                    res.json(workshop);
                }
            });
        };
        this.editWorkshopDetailes = (req, res) => {
            let newDataValue = req.body.newDataValue;
            let dataName = req.body.dataName;
            workshop_1.default.updateOne({ _id: new mongodb_1.ObjectId(req.body._id) }, { $set: { [dataName]: newDataValue } }, (error, success) => {
                if (error) {
                    console.log(error);
                }
                else {
                    if (dataName == "name")
                        signUp_1.default.updateMany({ idWorkshop: req.body._id }, { $set: { 'nameWorkshop': newDataValue } }, (error, success) => {
                            if (error)
                                console.log(error);
                            else
                                res.json({ "resp": "OK" });
                        });
                    else if (dataName == "date") {
                        signUp_1.default.updateMany({ idWorkshop: req.body._id }, { $set: { 'workshopDate': new Date(newDataValue) } }, (error, success) => {
                            if (error)
                                console.log(error);
                        });
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
                        signUp_1.default.updateMany({ idWorkshop: req.body._id }, { $set: { 'workshopPicture': newDataValue } }, (error, success) => {
                            if (error)
                                console.log(error);
                        });
                        Like_1.default.updateMany({ 'workshop._id': req.body._id }, { $set: { 'workshop.mainPhoto': newDataValue } }, (error, success) => {
                            if (error)
                                console.log(error);
                        });
                        Comment_1.default.updateMany({ 'workshop._id': req.body._id }, { $set: { 'workshop.mainPhoto': newDataValue } }, (error, success) => {
                            if (error)
                                console.log(error);
                        });
                    }
                }
            });
        };
        this.getSignUpRequests = (req, res) => {
            let organizer = req.body.organizer;
            let today = new Date();
            signUp_1.default.find({ workshopDate: { $gt: today }, organizer: organizer }, (error, signUps) => {
                if (signUps)
                    res.json(signUps);
                else
                    console.log(error);
            });
        };
        this.acceptRequestForWorkshop = (req, res) => {
            signUp_1.default.updateOne({
                username: req.body.username,
                idWorkshop: req.body.idWorkshop
            }, { $set: { status: 'accepted' } }, (error, success) => {
                if (error)
                    console.log(error);
                else {
                    workshop_1.default.updateOne({ _id: new mongodb_1.ObjectId(req.body.idWorkshop) }, { $inc: { bookedPlaces: 1 } }, (err, resp) => {
                        if (err)
                            console.log(err);
                        else
                            res.json({ 'resp': 'OK' });
                    });
                }
            });
        };
        this.getMessageRequests = (req, res) => {
            Message_1.default.aggregate([
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
                if (err)
                    console.log(err);
                else
                    res.json(messageRequests);
            });
        };
        this.getMessages = (req, res) => {
            // console.log("ID ", req.body.workshopId)
            Message_1.default.find({
                'workshop._id': req.body.workshopId,
                $or: [
                    { 'sender.username': req.body.senderUsername, 'recipient.username': req.body.recipientUsername },
                    { 'sender.username': req.body.recipientUsername, 'recipient.username': req.body.senderUsername }
                ]
            }).sort({ timestamp: 1 }).then(messages => {
                if (messages) {
                    res.json(messages);
                }
            });
        };
        this.sendMessage = (req, res) => {
            // console.log("sendMessage")
            let message = new Message_1.default({
                workshop: req.body.workshop,
                sender: req.body.sender,
                recipient: req.body.recipient,
                content: req.body.content,
                timestamp: req.body.timestamp
            });
            message.save().then(message => {
                if (message) {
                    res.json({ "resp": "OK" });
                }
            });
        };
        this.saveAsTemplate = (req, res) => {
            let workshop = req.body.workshop;
            const fs = require('fs');
            let templateData = JSON.stringify(workshop);
            let directoryPath = 'templatesWorkshop/' + workshop.organizer;
            const workshopName = workshop.name.replace(/\s+/g, "_");
            const filePath = path_1.default.join(directoryPath, workshopName + ".json");
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            fs.writeFile(filePath, templateData, (err) => {
                if (err)
                    throw err;
                else {
                    res.json({ "resp": "OK" });
                }
            });
        };
        this.getNamesOfTemplates = (req, res) => {
            const fs = require('fs');
            let organizer = req.body.organizer;
            fs.readdir('templatesWorkshop/' + organizer, (err, files) => {
                if (err) {
                    console.error(err);
                    return;
                }
                else {
                    res.json(files);
                }
            });
        };
        this.getTemplateData = (req, res) => {
            const fs = require('fs');
            fs.readFile('templatesWorkshop/' + req.body.organizer + '/' + req.body.templateName, (err, data) => {
                if (err)
                    throw err;
                const myObject = JSON.parse(data);
                res.json(myObject);
            });
        };
        this.cancelWorkshop = (req, res) => {
            let wName;
            let wOrganizer;
            let wPhoto;
            signUp_1.default.find({ idWorkshop: req.body.workshopId }, (err, signup) => {
                if (err)
                    console.log(err);
                else {
                    let usernames = [];
                    signup.forEach(s => {
                        usernames.push(s.username);
                    });
                    user_1.default.find({ username: { $in: usernames } }, (err, users) => {
                        if (err)
                            console.log(err);
                        else {
                            let emails = [];
                            users.forEach(u => {
                                emails.push(u.email);
                            });
                            if (signup) {
                                wName = signup[0].nameWorkshop;
                                wOrganizer = signup[0].organizer;
                                wPhoto = signup[0].workshopPicture;
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
                                from: '"' + wOrganizer + '" <artworkshop23@outlook.com>',
                                to: emails,
                                subject: '❌Cancellation❌',
                                text: 'Cancellation',
                                html: '<h1 style="text-align: center; color: red;">Cancellation of the workshop <strong>' + wName + '</strong></h1><p style="color: red; font-weight: bold;">CAUTION:</p><p">This workshop has been canceled by the organizer.</p>' // html body
                            };
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error);
                                }
                                else {
                                    console.log("Mail OK");
                                    res.json({ "resp": "OK" });
                                }
                            });
                            ////////////////////////////////////////////////////////////////////////////////
                        }
                    });
                }
            });
        };
    }
}
exports.OrganizerController = OrganizerController;
//# sourceMappingURL=organizer.controller.js.map