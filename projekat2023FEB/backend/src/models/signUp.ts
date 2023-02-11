import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

})


export default mongoose.model('SignUp', SignUp, 'signUps');