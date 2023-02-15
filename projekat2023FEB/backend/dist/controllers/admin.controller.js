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
            workshop_1.default.find({ status: "pending", date: { $gt: new Date() } }, (err, propositions) => {
                if (err)
                    console.log(err);
                else
                    res.json(propositions);
            });
        };
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map