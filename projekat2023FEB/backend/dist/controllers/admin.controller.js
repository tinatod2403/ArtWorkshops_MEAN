"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_1 = __importDefault(require("../models/user"));
const Admin_1 = __importDefault(require("../models/Admin"));
const workshop_1 = __importDefault(require("../models/workshop"));
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
                    console.log(users);
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