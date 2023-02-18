import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Like = new Schema({
    user: {
        type: Object
    },
    workshop: {
        type: Object
    }
})

export default mongoose.model('Like', Like, 'likes');