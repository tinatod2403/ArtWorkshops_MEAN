import express from 'express';
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




export default adminRouter;