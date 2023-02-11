import express from 'express';
import { UserController } from '../controllers/user.controller';


const userRouter = express.Router();

userRouter.route("/login").post(
    (req, res) => new UserController().login(req, res)
)
userRouter.route("/register").post(
    (req, res) => new UserController().register(req, res)
)
userRouter.route("/editData").post(
    (req, res) => new UserController().editData(req, res)
)
userRouter.route("/getUserData").post(
    (req, res) => new UserController().getUserData(req, res)
)
userRouter.route("/getAllActiveWorkshops").get(
    (req, res) => new UserController().getAllActiveWorkshops(req, res)
)
userRouter.route("/searchWorkshops").post(
    (req, res) => new UserController().searchWorkshops(req, res)
)
userRouter.route("/signUpForWorkshop").post(
    (req, res) => new UserController().signUpForWorkshop(req, res)
)
userRouter.route("/getUserRegistWorkshops").post(
    (req, res) => new UserController().getUserRegistWorkshops(req, res)
)
userRouter.route("/getPassedWorkshops").post(
    (req, res) => new UserController().getPassedWorkshops(req, res)
)

export default userRouter;