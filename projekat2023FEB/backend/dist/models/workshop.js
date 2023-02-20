"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Workshop = new Schema({
    name: {
        type: String
    },
    date: {
        type: Date
    },
    place: {
        type: String
    },
    shortDesc: {
        type: String
    },
    longDesc: {
        type: String
    },
    mainPhoto: {
        type: String
    },
    gallery: {
        type: Array
    },
    numOfPlaces: {
        type: Number
    },
    bookedPlaces: {
        type: Number
    },
    organizer: {
        type: String
    },
    status: {
        type: String
    },
    _id: {
        type: mongodb_1.ObjectId
    }
});
exports.default = mongoose_1.default.model('Workshop', Workshop, 'workshops');
//# sourceMappingURL=workshop.js.map