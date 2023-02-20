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
adminRouter.route("/updateStatus").post(
    (req, res) => new AdminController().updateStatus(req, res)
)
adminRouter.route("/approveWorkshop").post(
    (req, res) => new AdminController().approveWorkshop(req, res)
)
adminRouter.route("/changePassword").post(
    (req, res) => new AdminController().changePassword(req, res)
)
adminRouter.route("/deleteUser").post(
    (req, res) => new AdminController().deleteUser(req, res)
)
adminRouter.route("/deleteOrganizer").post(
    (req, res) => new AdminController().deleteOrganizer(req, res)
)




export default adminRouter;