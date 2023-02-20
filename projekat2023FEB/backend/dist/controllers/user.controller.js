"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
const user_1 = __importDefault(require("../models/user"));
const signUp_1 = __importDefault(require("../models/signUp"));
const Message_1 = __importDefault(require("../models/Message"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Like_1 = __importDefault(require("../models/Like"));
const mongodb_1 = require("mongodb");
const Waitlist_1 = __importDefault(require("../models/Waitlist"));
class UserController {
    constructor() {
        this.register = (req, res) => {
            user_1.default.findOne({ 'username': req.body.username }, (error, user) => {
                if (user) {
                    res.status(200).json({ 'resp': 'username' });
                }
                else
                    user_1.default.findOne({ 'email': req.body.email }, (error, user) => {
                        if (user) {
                            res.status(200).json({ 'resp': 'email' });
                        }
                        else {
                            let user = new user_1.default({
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                username: req.body.username,
                                password: req.body.password,
                                phone: req.body.phone,
                                email: req.body.email,
                                picture: req.body.picture,
                                isOrganizer: req.body.isOrganizer,
                                organizationName: req.body.organizationName,
                                address: req.body.address,
                                IDorganization: req.body.IDorganization,
                                status: req.body.status
                            });
                            user.save().then(user => {
                                res.status(200).json({ 'resp': 'OK' });
                            }).catch(err => {
                                res.status(400).json({ 'resp': 'error' });
                            });
                        }
                    });
            });
        };
        this.getTop5 = (req, res) => {
            Like_1.default.aggregate([
                {
                    $group: {
                        _id: "$workshop._id",
                        count: { $sum: 1 },
                        workshop: { $first: "$workshop" }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                },
                {
                    $limit: 5
                }
            ], function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.json(result);
                    // console.log(result);
                }
            });
        };
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ 'username': username, 'password': password }, (error, user) => {
                if (error)
                    console.log(error);
                else {
                    if (user) {
                        if (user.passwordDuration) {
                            if (new Date(user.passwordDuration) < new Date())
                                res.json({ 'resp': "expired" });
                            else
                                res.json({ 'user': user });
                        }
                        else {
                            res.json({ 'user': user });
                        }
                    }
                    else {
                        res.json({ 'user': user });
                    }
                }
            });
        };
        this.editData = (req, res) => {
            let newDataValue = req.body.newDataValue;
            let dataName = req.body.dataName;
            user_1.default.updateOne({ username: req.body.username }, { $set: { [dataName]: newDataValue } }, (error, success) => {
                if (error) {
                    console.log(error);
                }
                else if (dataName != "picture")
                    res.json({ "resp": "OK" });
            });
            if (dataName == "password") {
                user_1.default.updateOne({ username: req.body.username }, { $set: { passwordDuration: "" } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }
                });
            }
            if (dataName == "picture") {
                signUp_1.default.updateMany({ username: req.body.username }, { $set: { userPicture: newDataValue } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }
                });
                Message_1.default.updateMany({ 'sender.username': req.body.username }, { $set: { 'sender.picture': newDataValue } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }
                });
                Comment_1.default.updateMany({ 'sender.username': req.body.username }, { $set: { 'sender.picture': newDataValue } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }
                    else
                        res.json({ "resp": "OK" });
                });
            }
        };
        this.getUserData = (req, res) => {
            let username = req.body.username;
            user_1.default.findOne({ 'username': username }, (error, user) => {
                if (error)
                    console.log(error);
                else
                    res.json(user);
            });
        };
        this.getAllActiveWorkshops = (req, res) => {
            let today = new Date();
            workshop_1.default.find({ date: { $gt: today }, status: "accepted" }, (error, workshops) => {
                if (error)
                    console.log(error);
                else
                    res.json(workshops);
            });
        };
        this.searchWorkshops = (req, res) => {
            let searchValue = req.body.searchValue;
            console.log(searchValue);
            let today = new Date();
            workshop_1.default.find({
                date: { $gt: today },
                status: "accepted",
                $or: [
                    { name: { $regex: searchValue, $options: "i" } },
                    { place: { $regex: searchValue, $options: "i" } }
                ]
            }, (error, workshops) => {
                if (error)
                    console.log(error);
                else
                    res.json(workshops);
            });
        };
        this.signUpForWorkshop = (req, res) => {
            // console.log("Username", req.body.username);
            // console.log("idWorkshop", req.body.idWorkshop);
            signUp_1.default.findOne({ 'username': req.body.username, 'idWorkshop': req.body.idWorkshop }, (error, user) => {
                if (user) {
                    res.json({ "resp": "exists" });
                }
                else {
                    let sigUpInstance = new signUp_1.default({
                        username: req.body.username,
                        userPicture: req.body.userPicture,
                        idWorkshop: req.body.idWorkshop,
                        nameWorkshop: req.body.nameWorkshop,
                        workshopPicture: req.body.workshopPicture,
                        organizer: req.body.organizer,
                        signUpDate: req.body.signUpDate,
                        workshopDate: req.body.workshopDate,
                        status: req.body.status
                    });
                    sigUpInstance.save().then(user => {
                        res.status(200).json({ 'resp': 'OK' });
                    }).catch(err => {
                        res.status(400).json({ 'resp': 'error' });
                    });
                }
            });
        };
        this.getUserRegistWorkshops = (req, res) => {
            let username = req.body.username;
            let today = new Date();
            signUp_1.default.find({ workshopDate: { $gt: today }, username: username }, (error, signUps) => {
                if (signUps)
                    res.json(signUps);
                else
                    console.log(error);
            });
        };
        this.getPassedWorkshops = (req, res) => {
            let username = req.body.username;
            let today = new Date();
            signUp_1.default.find({ workshopDate: { $lt: today }, username: username }, (error, signUps) => {
                if (signUps)
                    res.json(signUps);
                else
                    console.log(error);
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
        this.getMessages = (req, res) => {
            // console.log("ID ",req.body.workshopId)
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
        this.sendComment = (req, res) => {
            let comment = new Comment_1.default({
                workshop: req.body.workshop,
                sender: req.body.sender,
                content: req.body.content,
                timestamp: req.body.timestamp
            });
            comment.save().then(c => {
                if (c)
                    res.json({ "resp": "OK" });
            });
        };
        this.getWorkshopComments = (req, res) => {
            let workshop = req.body.workshop;
            Comment_1.default.find({ 'workshop._id': workshop._id }, (err, comments) => {
                if (err)
                    console.log(err);
                else {
                    res.json(comments);
                }
            });
        };
        this.likeWorkshop = (req, res) => {
            let workshop = req.body.workshop;
            let user = req.body.user;
            Like_1.default.findOne({ 'user.username': user.username, 'workshop._id': workshop._id }, (err, like) => {
                if (err)
                    console.log(err);
                else if (like == null) {
                    let like = new Like_1.default({
                        workshop: workshop,
                        user: user
                    });
                    like.save().then((resp) => {
                        res.json({ "resp": "OK" });
                    });
                }
            });
        };
        this.unlikeWorkshop = (req, res) => {
            let workshop = req.body.workshop;
            let user = req.body.user;
            Like_1.default.deleteOne({ 'user.username': user.username, 'workshop._id': workshop._id }, (err, like) => {
                if (err)
                    console.log(err);
                else
                    res.json({ "resp": "OK" });
            });
        };
        this.likesOfWorkshop = (req, res) => {
            let workshop = req.body.workshop;
            let user = req.body.user;
            // console.log(workshop)
            Like_1.default.findOne({ 'user.username': user.username, 'workshop._id': workshop._id }, (err, like) => {
                if (err)
                    console.log(err);
                else if (like == null) {
                    Like_1.default.find({ 'workshop._id': workshop._id }, (err, likes) => {
                        if (err)
                            console.log(err);
                        else
                            res.json({ likes: likes, resp: "noUser" });
                    });
                }
                else if (like != null) {
                    Like_1.default.find({ 'workshop._id': workshop._id }, (err, likes) => {
                        if (err)
                            console.log(err);
                        else
                            res.json({ likes: likes, resp: "yesUser" });
                    });
                }
            });
        };
        this.getAllUserLikedWorkshops = (req, res) => {
            Like_1.default.find({ 'user.username': req.body.username }, (err, likes) => {
                if (err)
                    console.log(err);
                else
                    res.json(likes);
            });
        };
        this.getAllUserComments = (req, res) => {
            Comment_1.default.find({ 'sender.username': req.body.username }, (err, comm) => {
                if (err)
                    console.log(err);
                else
                    res.json(comm);
            });
        };
        this.editComment = (req, res) => {
            let comment = req.body.comment;
            Comment_1.default.updateOne({ _id: new mongodb_1.ObjectId(comment._id) }, {
                $set: { content: comment.content }
            }, (err, comm) => {
                if (err)
                    console.log(err);
                else {
                    Comment_1.default.find({ 'sender.username': comment.sender.username }, (err, comms) => {
                        if (err)
                            console.log(err);
                        else
                            res.json(comms);
                    });
                }
            });
        };
        this.deleteComment = (req, res) => {
            let comment = req.body.comment;
            Comment_1.default.deleteOne({ _id: new mongodb_1.ObjectId(comment._id) }, (err, comm) => {
                if (err)
                    console.log(err);
                else {
                    Comment_1.default.find({ 'sender.username': comment.sender.username }, (err, comms) => {
                        if (err)
                            console.log(err);
                        else
                            res.json(comms);
                    });
                }
            });
        };
        this.getMyMessages = (req, res) => {
            let sender = req.body.sender;
            Message_1.default.aggregate([
                {
                    $match: {
                        'sender.username': sender.username
                    }
                },
                {
                    $group: {
                        _id: '$workshop._id',
                        workshopName: { $first: '$workshop.name' },
                        workshopID: { $first: '$workshop._id' },
                        senderUsername: { $first: '$recipient.username' },
                        senderPicture: { $first: '$recipient.picture' } //ceo ovaj deo je predebilan i nema smisla sa imenima polja zbog glupe klase na frontu
                    }
                }
            ], (err, messageRequests) => {
                if (err)
                    console.log(err);
                else
                    res.json(messageRequests);
            });
        };
        this.generateNewPassword = (req, res) => {
            user_1.default.findOne({ email: req.body.email }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    let duration = new Date();
                    duration.setTime(duration.getTime() + (30 * 60 * 1000));
                    console.log(duration);
                    if (user) {
                        let newPass = this.generatePassword();
                        console.log(newPass);
                        ///////////////////////////////////////////////////////////////////////////////
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
                            from: 'Admin <artworkshop23@outlook.com>',
                            to: req.body.email,
                            subject: 'NEW PASSWORD',
                            text: 'NEW PASSWORD',
                            html: '<h1 style="text-align: center;">New password for user: <strong>' + user.username + '</strong></h1><p style="color: red; font-weight: bold;">CAUTION:</p><p>' + newPass + '</p><p>This password is valid for 30minutes.</p>' // html body
                        };
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                {
                                    console.log("Mail OK");
                                    user_1.default.updateOne({ username: user.username }, { $set: { password: newPass, passwordDuration: duration } }, { upsert: true }, (err, resp) => {
                                        if (err)
                                            console.log(err);
                                        else
                                            res.json({ "resp": "OK" });
                                    });
                                }
                            }
                        });
                    }
                    else
                        res.json({ "resp": "noUser" });
                }
            });
        };
        this.withdrawSigUpRequst = (req, res) => {
            signUp_1.default.deleteOne({ username: req.body.username, idWorkshop: req.body.idWorkshop }, (err, resp) => {
                if (err)
                    console.log(err);
                else {
                    signUp_1.default.find({ username: req.body.username }, (err, s) => {
                        if (err)
                            console.log(err);
                        else
                            res.json(s);
                    });
                }
            });
            let workshop;
            workshop_1.default.findOne({ _id: new mongodb_1.ObjectId(req.body.idWorkshop) }, (err, w) => {
                if (err)
                    console.log(err);
                else {
                    workshop = w;
                    workshop_1.default.updateOne({ _id: new mongodb_1.ObjectId(req.body.idWorkshop) }, { $inc: { bookedPlaces: -1 } }, (err, resp) => {
                        if (err)
                            console.log(err);
                        else {
                            Waitlist_1.default.find({ 'workshop._id': req.body.idWorkshop }, (err, users) => {
                                if (err)
                                    console.log(err);
                                else {
                                    if (users) {
                                        let emails = [];
                                        users.forEach(u => {
                                            emails.push(u.user.email);
                                        });
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
                                            from: '"' + workshop.name + '" <artworkshop23@outlook.com>',
                                            to: emails,
                                            subject: 'FREE SPOT',
                                            text: 'Cancellation',
                                            html: '<h1 style="text-align: center; color: green;">SPOT HAS BEEN FREED in workshop <strong>' + workshop.name + '</strong></h1><p>This workshop has one more place, hurry up.</p>' // html body
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
                                    }
                                }
                            });
                        }
                    });
                }
            });
        };
        this.waitlistForWorkshop = (req, res) => {
            let user = req.body.user;
            let workshop = req.body.workshop;
            Waitlist_1.default.findOne({ "user.username": user.username, "workshop._id": workshop._id }, (err, user) => {
                if (err)
                    console.log(err);
                else if (user)
                    res.json({ "resp": "already" });
                else {
                    let waitlist = new Waitlist_1.default({
                        user: req.body.user,
                        workshop: req.body.workshop
                    });
                    waitlist.save().then(w => {
                        if (w)
                            res.json({ "resp": "OK" });
                    });
                }
            });
        };
    }
    generatePassword() {
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialCharacters = '!@#$%^&*()_+-={}[]|\\:;<>,.?';
        const passwordLength = Math.floor(Math.random() * 9) + 8; // generates a random number between 8 and 16
        const firstChar = lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length)); // generates a random lowercase letter for the first character
        const remainingChars = passwordLength - 1;
        const remainingCharsTypes = [
            uppercaseLetters,
            numbers,
            specialCharacters,
            lowercaseLetters
        ];
        let password = firstChar;
        for (let i = 0; i < remainingChars; i++) {
            const randomCharType = remainingCharsTypes[Math.floor(Math.random() * remainingCharsTypes.length)];
            const randomChar = randomCharType.charAt(Math.floor(Math.random() * randomCharType.length));
            password += randomChar;
        }
        return password;
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map