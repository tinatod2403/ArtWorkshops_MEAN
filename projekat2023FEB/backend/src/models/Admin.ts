import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Admin = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    lastname: {
        type: String
    },
    firstname: {
        type: String
    }
})

export default mongoose.model('Admin', Admin, 'admins');