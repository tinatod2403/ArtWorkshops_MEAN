import express from 'express';
import { OrganizerController } from '../controllers/organizer.controller';

const organizerRouter = express.Router();

organizerRouter.route("/addWorkshop").post(
    (req, res) => new OrganizerController().addWorkshop(req, res)
)

organizerRouter.route("/getMyWorkshops").post(
    (req, res) => new OrganizerController().getMyWorkshops(req, res)
)
organizerRouter.route("/workshopDetails").post(
    (req, res) => new OrganizerController().workshopDetails(req, res)
)
organizerRouter.route("/editWorkshopDetailes").post(
    (req, res) => new OrganizerController().editWorkshopDetailes(req, res)
)
organizerRouter.route("/getSignUpRequests").post(
    (req, res) => new OrganizerController().getSignUpRequests(req, res)
)
organizerRouter.route("/acceptRequestForWorkshop").post(
    (req, res) => new OrganizerController().acceptRequestForWorkshop(req, res)
)
organizerRouter.route("/getMessageRequests").post(
    (req, res) => new OrganizerController().getMessageRequests(req, res)
)
organizerRouter.route("/getMessages").post(
    (req, res) => new OrganizerController().getMessages(req, res)
)
organizerRouter.route("/sendMessage").post(
    (req, res) => new OrganizerController().sendMessage(req, res)
)
organizerRouter.route("/cancelWorkshop").post(
    (req, res) => new OrganizerController().cancelWorkshop(req, res)
)





export default organizerRouter;