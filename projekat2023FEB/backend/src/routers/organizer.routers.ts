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




export default organizerRouter;