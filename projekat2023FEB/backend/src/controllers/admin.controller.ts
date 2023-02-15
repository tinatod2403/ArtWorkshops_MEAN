import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import user from '../models/user';
import Admin from '../models/Admin';
import workshop from '../models/workshop';

export class AdminController {


    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        Admin.findOne({ 'username': username, 'password': password }, (error, admin) => {

            if
                (error) console.log(error);
            else
                res.json(admin);
        })
    }


    getRegistrationRequests = (req: express.Request, res: express.Response) => {

        user.find({ status: "pending" }, (err, request) => {
            if (err) console.log(err)
            else res.json(request)
        })
    }



    getWorkshopPropositions = (req: express.Request, res: express.Response) => {

        workshop.find({ status: "pending", date: { $gt: new Date() } }, (err, propositions) => {
            if (err) console.log(err)
            else res.json(propositions)
        })

    }
}