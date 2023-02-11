"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
const user_1 = __importDefault(require("../models/user"));
const signUp_1 = __importDefault(require("../models/signUp"));
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
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ 'username': username, 'password': password }, (error, user) => {
                if (error)
                    console.log(error);
                else
                    res.json(user);
            });
        };
        this.editData = (req, res) => {
            let newDataValue = req.body.newDataValue;
            let dataName = req.body.dataName;
            user_1.default.updateOne({ username: req.body.username }, { $set: { [dataName]: newDataValue } }, (error, success) => {
                if (error) {
                    console.log(error);
                }
                else
                    res.json({ "resp": "OK" });
            });
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
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map