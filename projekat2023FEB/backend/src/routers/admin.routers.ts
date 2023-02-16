import express from 'express';
import { MailController } from '../controllers/mail.controller';
import { AdminController } from '../controllers/admin.controller';


const adminRouter = express.Router();

adminRouter.route("/login").post(
    (req, res) => new AdminController().login(req, res)
)
adminRouter.route("/getRegistrationRequests").get(
    (req, res) => new AdminController().getRegistrationRequests(req, res)
)
adminRouter.route("/getWorkshopPropositions").get(
    (req, res) => new AdminController().getWorkshopPropositions(req, res)
)
adminRouter.route("/sendMail").get(
    (req, res) => new AdminController().sendMail(req, res)
)




export default adminRouter;