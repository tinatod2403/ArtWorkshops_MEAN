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
exports.default = organizerRouter;
//# sourceMappingURL=organizer.routers.js.map