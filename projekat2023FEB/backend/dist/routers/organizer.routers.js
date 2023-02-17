"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organizer_controller_1 = require("../controllers/organizer.controller");
const organizerRouter = express_1.default.Router();
organizerRouter.route("/addWorkshop").post((req, res) => new organizer_controller_1.OrganizerController().addWorkshop(req, res));
organizerRouter.route("/getMyWorkshops").post((req, res) => new organizer_controller_1.OrganizerController().getMyWorkshops(req, res));
organizerRouter.route("/workshopDetails").post((req, res) => new organizer_controller_1.OrganizerController().workshopDetails(req, res));
organizerRouter.route("/editWorkshopDetailes").post((req, res) => new organizer_controller_1.OrganizerController().editWorkshopDetailes(req, res));
organizerRouter.route("/getSignUpRequests").post((req, res) => new organizer_controller_1.OrganizerController().getSignUpRequests(req, res));
organizerRouter.route("/acceptRequestForWorkshop").post((req, res) => new organizer_controller_1.OrganizerController().acceptRequestForWorkshop(req, res));
organizerRouter.route("/getMessageRequests").post((req, res) => new organizer_controller_1.OrganizerController().getMessageRequests(req, res));
organizerRouter.route("/getMessages").post((req, res) => new organizer_controller_1.OrganizerController().getMessages(req, res));
organizerRouter.route("/sendMessage").post((req, res) => new organizer_controller_1.OrganizerController().sendMessage(req, res));
organizerRouter.route("/cancelWorkshop").post((req, res) => new organizer_controller_1.OrganizerController().cancelWorkshop(req, res));
organizerRouter.route("/saveAsTemplate").post((req, res) => new organizer_controller_1.OrganizerController().saveAsTemplate(req, res));
organizerRouter.route("/getNamesOfTemplates").post((req, res) => new organizer_controller_1.OrganizerController().getNamesOfTemplates(req, res));
organizerRouter.route("/getTemplateData").post((req, res) => new organizer_controller_1.OrganizerController().getTemplateData(req, res));
exports.default = organizerRouter;
//# sourceMappingURL=organizer.routers.js.map