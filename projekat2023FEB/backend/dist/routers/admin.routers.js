"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const adminRouter = express_1.default.Router();
adminRouter.route("/login").post((req, res) => new admin_controller_1.AdminController().login(req, res));
adminRouter.route("/getRegistrationRequests").get((req, res) => new admin_controller_1.AdminController().getRegistrationRequests(req, res));
adminRouter.route("/getWorkshopPropositions").get((req, res) => new admin_controller_1.AdminController().getWorkshopPropositions(req, res));
adminRouter.route("/sendMail").get((req, res) => new admin_controller_1.AdminController().sendMail(req, res));
exports.default = adminRouter;
//# sourceMappingURL=admin.routers.js.map