"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Message = new Schema({
    workshop: {
        type: Object
    },
    sender: {
        type: Object
    },
    recipient: {
        type: Object
    },
    content: {
        type: String
    },
    timestamp: {
        type: String
    }
});
exports.default = mongoose_1.default.model('Message', Message, 'messages');
//# sourceMappingURL=Message.js.map