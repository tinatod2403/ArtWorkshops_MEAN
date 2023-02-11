"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let SignUp = new Schema({
    username: {
        type: String
    },
    userPicture: {
        type: String
    },
    idWorkshop: {
        type: String
    },
    nameWorkshop: {
        type: String
    },
    workshopPicture: {
        type: String
    },
    organizer: {
        type: String
    },
    signUpDate: {
        type: Date
    },
    workshopDate: {
        type: Date
    },
    status: {
        type: String
    },
});
exports.default = mongoose_1.default.model('SignUp', SignUp, 'signUps');
//# sourceMappingURL=signUp.js.map