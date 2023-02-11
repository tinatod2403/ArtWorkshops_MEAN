"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerController = void 0;
const mongodb_1 = require("mongodb");
const signUp_1 = __importDefault(require("../models/signUp"));
const workshop_1 = __importDefault(require("../models/workshop"));
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
                    else if (dataName == "date")
                        signUp_1.default.updateMany({ idWorkshop: req.body._id }, { $set: { 'workshopDate': new Date(newDataValue) } }, (error, success) => {
                            if (error)
                                console.log(error);
                            else
                                res.json({ "resp": "OK" });
                        });
                    else if (dataName == "photo") {
                        //TODO
                    }
                }
            });
        };
    }
}
exports.OrganizerController = OrganizerController;
//# sourceMappingURL=organizer.controller.js.map