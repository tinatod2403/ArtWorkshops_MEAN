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
userRouter.route("/sendMessage").post(
    (req, res) => new UserController().sendMessage(req, res)
)
userRouter.route("/getMessages").post(
    (req, res) => new UserController().getMessages(req, res)
)
userRouter.route("/sendComment").post(
    (req, res) => new UserController().sendComment(req, res)
)
userRouter.route("/getWorkshopComments").post(
    (req, res) => new UserController().getWorkshopComments(req, res)
)
userRouter.route("/likeWorkshop").post(
    (req, res) => new UserController().likeWorkshop(req, res)
)
userRouter.route("/unlikeWorkshop").post(
    (req, res) => new UserController().unlikeWorkshop(req, res)
)
userRouter.route("/likesOfWorkshop").post(
    (req, res) => new UserController().likesOfWorkshop(req, res)
)
userRouter.route("/getAllUserLikedWorkshops").post(
    (req, res) => new UserController().getAllUserLikedWorkshops(req, res)
)
userRouter.route("/getAllUserComments").post(
    (req, res) => new UserController().getAllUserComments(req, res)
)
userRouter.route("/editComment").post(
    (req, res) => new UserController().editComment(req, res)
)
userRouter.route("/deleteComment").post(
    (req, res) => new UserController().deleteComment(req, res)
)
userRouter.route("/getMyMessages").post(
    (req, res) => new UserController().getMyMessages(req, res)
)
userRouter.route("/generateNewPassword").post(
    (req, res) => new UserController().generateNewPassword(req, res)
)
userRouter.route("/withdrawSigUpRequst").post(
    (req, res) => new UserController().withdrawSigUpRequst(req, res)
)
userRouter.route("/waitlistForWorkshop").post(
    (req, res) => new UserController().waitlistForWorkshop(req, res)
)
userRouter.route("/getTop5").get(
    (req, res) => new UserController().getTop5(req, res)
)
export default userRouter;