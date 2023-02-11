"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.route("/login").post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route("/register").post((req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route("/editData").post((req, res) => new user_controller_1.UserController().editData(req, res));
userRouter.route("/getUserData").post((req, res) => new user_controller_1.UserController().getUserData(req, res));
userRouter.route("/getAllActiveWorkshops").get((req, res) => new user_controller_1.UserController().getAllActiveWorkshops(req, res));
userRouter.route("/searchWorkshops").post((req, res) => new user_controller_1.UserController().searchWorkshops(req, res));
userRouter.route("/signUpForWorkshop").post((req, res) => new user_controller_1.UserController().signUpForWorkshop(req, res));
userRouter.route("/getUserRegistWorkshops").post((req, res) => new user_controller_1.UserController().getUserRegistWorkshops(req, res));
userRouter.route("/getPassedWorkshops").post((req, res) => new user_controller_1.UserController().getPassedWorkshops(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.routers.js.map