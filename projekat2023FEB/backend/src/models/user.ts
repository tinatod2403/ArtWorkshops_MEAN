import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    picture: {
        type: String
    },
    isOrganizer: {
        type: Boolean
    },

    //  If User is the Organizer:

    organizationName: {
        type: String
    },
    address: {
        type: String
    },
    IDorganization: {
        type: String
    },
    status: {
        type: String
    }

})

export default mongoose.model('User', User, 'users');