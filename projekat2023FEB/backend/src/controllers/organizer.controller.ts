import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import { ParsedQs } from 'qs';
import signUp from '../models/signUp';
import Workshop from '../models/workshop';

export class OrganizerController {

    addWorkshop = (req: express.Request, res: express.Response) => {
        let workshop = new Workshop({
            name: req.body.name,
            date: req.body.date,
            place: req.body.place,
            shortDesc: req.body.shortDesc,
            longDesc: req.body.longDesc,
            mainPhoto: req.body.mainPhoto,
            gallery: req.body.gallery,
            numOfPlaces: req.body.numOfPlaces,
            organizer: req.body.organizer,
            status: req.body.status,
            _id: new ObjectId()

        })
        console.log("broj ", req.body.numOfPlaces)

        workshop.save().then(user => {
            res.status(200).json({ 'resp': 'OK' });
        }).catch(err => {
            res.status(400).json({ 'resp': 'error' })
        })


    }

    getMyWorkshops = (req: express.Request, res: express.Response) => {
        let organizer = req.body.organizer

        Workshop.find({ organizer: organizer }, (error, workshops) => {

            if
                (error) console.log(error);
            else {
                // console.log("ima li ih: ", workshops);
                res.json(workshops);
            }

        })
    }

    workshopDetails = (req: express.Request, res: express.Response) => {
        let id = new ObjectId(req.body.id)

        Workshop.findOne({ _id: id }, (error, workshop) => {
            if
                (error) console.log(error);
            else {
                res.json(workshop);
            }
        })

    }



    editWorkshopDetailes = (req: express.Request, res: express.Response) => {

        let newDataValue = req.body.newDataValue;
        let dataName = req.body.dataName;

        Workshop.updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: { [dataName]: newDataValue } }, (error, success) => {
                if (error) {
                    console.log(error);
                }
                else {
                    if (dataName == "name")
                        signUp.updateMany(
                            { idWorkshop: req.body._id },
                            { $set: { 'nameWorkshop': newDataValue } }, (error, success) => {
                                if (error)
                                    console.log(error);
                                else
                                    res.json({ "resp": "OK" })

                            }
                        );
                    else if (dataName == "date")
                        signUp.updateMany(
                            { idWorkshop: req.body._id },
                            { $set: { 'workshopDate': new Date(newDataValue) } }, (error, success) => {
                                if (error)
                                    console.log(error);
                                else
                                    res.json({ "resp": "OK" })

                            }
                        );
                    else if (dataName == "photo") {
                        //TODO
                    }


                }
            }
        );
    }

    getSignUpRequests = (req: express.Request, res: express.Response) => {//dobro za dodavanje i bivsih ucesnika

        let organizer = req.body.organizer;
        let today = new Date();

        signUp.find({ workshopDate: { $gt: today }, organizer: organizer }, (error, signUps) => {

            if (signUps)
                res.json(signUps)
            else
                console.log(error)
        })
    }

    acceptRequestForWorkshop = (req: express.Request, res: express.Response) => {

        signUp.updateOne(
            {
                username: req.body.username,
                idWorkshop: req.body.idWorkshop
            }, { $set: { status: 'accepted' } }, (error, success) => {
                if
                    (error) console.log(error)
                else
                    res.json({ "resp": "OK" })
            })
    }

}