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
adminRouter.route("/getAllUsers").get(
    (req, res) => new AdminController().getAllUsers(req, res)
)
adminRouter.route("/getAllOrganizers").get(
    (req, res) => new AdminController().getAllOrganizers(req, res)
)
adminRouter.route("/getAllWorkshops").get(
    (req, res) => new AdminController().getAllWorkshops(req, res)
)
adminRouter.route("/sendMail").get(
    (req, res) => new AdminController().sendMail(req, res)
)




export default adminRouter;