import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
    organizer: {
        type: String
    },
    status: {
        type: String
    },
    _id: {
        type: ObjectId
    }
})


export default mongoose.model('Workshop', Workshop, 'workshops');