"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_1 = __importDefault(require("../models/user"));
const Admin_1 = __importDefault(require("../models/Admin"));
const workshop_1 = __importDefault(require("../models/workshop"));
const mongodb_1 = require("mongodb");
const Comment_1 = __importDefault(require("../models/Comment"));
const Like_1 = __importDefault(require("../models/Like"));
const Message_1 = __importDefault(require("../models/Message"));
const Waitlist_1 = __importDefault(require("../models/Waitlist"));
const signUp_1 = __importDefault(require("../models/signUp"));
class AdminController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            Admin_1.default.findOne({ 'username': username, 'password': password }, (error, admin) => {
                if (error)
                    console.log(error);
                else
                    res.json(admin);
            });
        };
        this.getRegistrationRequests = (req, res) => {
            user_1.default.find({ status: "pending" }, (err, request) => {
                if (err)
                    console.log(err);
                else
                    res.json(request);
            });
        };
        this.getWorkshopPropositions = (req, res) => {
            // console.log("getWorkshopPropositions")
            workshop_1.default.find({ status: "pending", date: { $gt: new Date() } }, (err, propositions) => {
                if (err)
                    console.log(err);
                else
                    res.json(propositions);
            });
        };
        this.getAllUsers = (req, res) => {
            user_1.default.find({ isOrganizer: false }, (err, users) => {
                if (err)
                    console.log(err);
                else {
                    // console.log(users)
                    res.json(users);
                }
            });
        };
        this.getAllOrganizers = (req, res) => {
            user_1.default.find({ isOrganizer: true }, (err, organizers) => {
                if (err)
                    console.log(err);
                else {
                    res.json(organizers);
                }
            });
        };
        this.getAllWorkshops = (req, res) => {
            workshop_1.default.find({}, (err, workshops) => {
                if (err)
                    console.log(err);
                else {
                    res.json(workshops);
                }
            });
        };
        this.updateStatus = (req, res) => {
            user_1.default.updateOne({ username: req.body.username }, { $set: { status: req.body.value } }, (err, resp) => {
                if (err)
                    console.log(err);
                else
                    res.json({ 'resp': "OK" });
            });
        };
        this.approveWorkshop = (req, res) => {
            workshop_1.default.updateOne({ _id: new mongodb_1.ObjectId(req.body.id) }, { $set: { status: 'accepted' } }, (err, resp) => {
                if (err)
                    console.log(err);
                else
                    res.json({ 'resp': "OK" });
            });
        };
        this.changePassword = (req, res) => {
            // console.log(req.body.username)
            // console.log(req.body.newPass)
            Admin_1.default.updateOne({ username: req.body.username }, { $set: { password: req.body.newPass } }, (err, resp) => {
                if (err)
                    console.log(err);
                else
                    res.json({ 'resp': "OK" });
            });
        };
        this.deleteUser = (req, res) => {
            let u = req.body.user;
            Comment_1.default.deleteMany({ 'sender.username': u.username }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            Like_1.default.deleteMany({ 'user.username': u.username }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            Message_1.default.deleteMany({
                $or: [
                    { 'sender.username': u.username },
                    { 'recipient.username': u.username }
                ]
            }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            Waitlist_1.default.deleteOne({ 'user.username': u.username }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            signUp_1.default.find({ 'username': u.username, 'status': 'accepted' }, (err, signups) => {
                if (err)
                    console.log(err);
                else {
                    let ids = [];
                    signups.forEach(s => {
                        ids.push(new mongodb_1.ObjectId(s.idWorkshop));
                    });
                    console.log(ids);
                    workshop_1.default.updateMany({ '_id': { $in: ids } }, { $inc: { bookedPlaces: -1 } }, (err, resp) => {
                        if (err)
                            console.log(err);
                    });
                    signUp_1.default.deleteMany({ 'username': u.username }, (err, resp) => {
                        if (err)
                            console.log(err);
                    });
                }
            });
            user_1.default.deleteOne({ username: u.username }, (err, resp) => {
                if (err)
                    console.log(err);
                else {
                    user_1.default.find({ isOrganizer: false }, (err, users) => {
                        if (err)
                            console.log(err);
                        else
                            res.json(users);
                    });
                }
            });
        };
        this.deleteOrganizer = (req, res) => {
            let organizer = req.body.organizer;
            Message_1.default.deleteMany({
                $or: [
                    { 'sender.username': organizer.username },
                    { 'recipient.username': organizer.username }
                ]
            }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            console.log(organizer.username);
            Like_1.default.deleteMany({ 'workshop.organizer': organizer.username }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            Comment_1.default.deleteMany({ 'workshop.organizer': organizer.username }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            signUp_1.default.deleteMany({ 'organizer': organizer.username }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            workshop_1.default.deleteMany({ organizer: organizer.username }, (err, resp) => {
                if (err)
                    console.log(err);
            });
            user_1.default.deleteOne({ username: organizer.username }, (err, resp) => {
                if (err)
                    console.log(err);
                else {
                    user_1.default.find({ isOrganizer: true }, (err, org) => {
                        if (err)
                            console.log(err);
                        else
                            res.json(org);
                    });
                }
            });
        };
        this.sendMail = (req, res) => {
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
                from: '"Admin" <artworkshop23@outlook.com>',
                to: 'kristinatodorovic2403@gmail.com',
                subject: 'Hello ✔',
                text: 'Hello world?',
                html: '<h1>FILIP MAGARAC</h1>' // html body
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
        };
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map