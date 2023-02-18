import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Comment = new Schema({
    workshop: {
        type: Object
    },
    sender: {
        type: Object
    },
    content: {
        type: String
    },
    timestamp: {
        type: Date
    }

})

export default mongoose.model('Comment', Comment, 'comments');