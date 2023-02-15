import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

})

export default mongoose.model('Message', Message, 'messages');