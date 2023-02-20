import mongoose from "mongoose";

const Schema = mongoose.Schema;

let WaitList = new Schema({
    user: {
        type: Object
    },
    workshop: {
        type: Object
    }
})

export default mongoose.model('WaitList', WaitList, 'waitList');