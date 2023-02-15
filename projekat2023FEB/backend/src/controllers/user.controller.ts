import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import Workshop from '../models/workshop';
import User from '../models/user';
import SignUp from '../models/signUp';
import Message from '../models/Message';

export class UserController {
    register = (req: express.Request, res: express.Response) => {

        User.findOne({ 'username': req.body.username }, (error, user) => {

            if (user) {
                res.status(200).json({ 'resp': 'username' });

            }
            else
                User.findOne({ 'email': req.body.email }, (error, user) => {

                    if (user) {
                        res.status(200).json({ 'resp': 'email' });

                    }
                    else {

                        let user = new User({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username,
                            password: req.body.password,
                            phone: req.body.phone,
                            email: req.body.email,
                            picture: req.body.picture,
                            isOrganizer: req.body.isOrganizer,
                            organizationName: req.body.organizationName,
                            address: req.body.address,
                            IDorganization: req.body.IDorganization,
                            status: req.body.status
                        })

                        user.save().then(user => {
                            res.status(200).json({ 'resp': 'OK' });
                        }).catch(err => {
                            res.status(400).json({ 'resp': 'error' })
                        })


                    }

                })

        })

    }

    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({ 'username': username, 'password': password }, (error, user) => {

            if
                (error) console.log(error);
            else
                res.json(user);
        })
    }

    editData = (req: express.Request, res: express.Response) => {

        let newDataValue = req.body.newDataValue;
        let dataName = req.body.dataName;

        User.updateOne(
            { username: req.body.username },
            { $set: { [dataName]: newDataValue } }, (error, success) => {
                if (error) {
                    console.log(error);
                }
                else res.json({ "resp": "OK" })
            }
        );

    }

    getUserData = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        User.findOne({ 'username': username }, (error, user) => {

            if
                (error) console.log(error);
            else
                res.json(user);
        })
    }

    getAllActiveWorkshops = (req: express.Request, res: express.Response) => {
        let today = new Date();
        Workshop.find({ date: { $gt: today }, status: "accepted" }, (error, workshops) => {
            if (error) console.log(error);
            else res.json(workshops);
        });
    };

    searchWorkshops = (req: express.Request, res: express.Response) => {
        let searchValue = req.body.searchValue;
        console.log(searchValue)
        let today = new Date();
        Workshop.find({
            date: { $gt: today },
            status: "accepted",
            $or: [
                { name: { $regex: searchValue, $options: "i" } },
                { place: { $regex: searchValue, $options: "i" } }
            ]
        }, (error, workshops) => {
            if (error) console.log(error);
            else res.json(workshops);
        });
    };

    signUpForWorkshop = (req: express.Request, res: express.Response) => {

        // console.log("Username", req.body.username);
        // console.log("idWorkshop", req.body.idWorkshop);
        SignUp.findOne({ 'username': req.body.username, 'idWorkshop': req.body.idWorkshop }, (error, user) => {

            if (user) {
                res.json({ "resp": "exists" })
            }
            else {

                let sigUpInstance = new SignUp({

                    username: req.body.username,
                    userPicture: req.body.userPicture,
                    idWorkshop: req.body.idWorkshop,
                    nameWorkshop: req.body.nameWorkshop,
                    workshopPicture: req.body.workshopPicture,
                    organizer: req.body.organizer,
                    signUpDate: req.body.signUpDate,
                    workshopDate: req.body.workshopDate,
                    status: req.body.status

                })

                sigUpInstance.save().then(user => {
                    res.status(200).json({ 'resp': 'OK' });
                }).catch(err => {
                    res.status(400).json({ 'resp': 'error' })
                })
            }

        })


    }

    getUserRegistWorkshops = (req: express.Request, res: express.Response) => {

        let username = req.body.username;
        let today = new Date();

        SignUp.find({ workshopDate: { $gt: today }, username: username }, (error, signUps) => {

            if (signUps)
                res.json(signUps)
            else
                console.log(error)
        })
    }

    getPassedWorkshops = (req: express.Request, res: express.Response) => {

        let username = req.body.username;
        let today = new Date();

        SignUp.find({ workshopDate: { $lt: today }, username: username }, (error, signUps) => {

            if (signUps)
                res.json(signUps)
            else
                console.log(error)
        })
    }

    sendMessage = (req: express.Request, res: express.Response) => {

        // console.log("sendMessage")

        let message = new Message({
            workshop: req.body.workshop,
            sender: req.body.sender,
            recipient: req.body.recipient,
            content: req.body.content,
            timestamp: req.body.timestamp
        })

        message.save().then(message => {
            if (message) {
                res.json({ "resp": "OK" })
            }
        })

    }


    getMessages = (req: express.Request, res: express.Response) => {
        // console.log("ID ",req.body.workshopId)
        Message.find({
            'workshop._id': req.body.workshopId,
            $or: [
                { 'sender.username': req.body.senderUsername, 'recipient.username': req.body.recipientUsername },
                { 'sender.username': req.body.recipientUsername, 'recipient.username': req.body.senderUsername }
            ]
        }
        ).sort({ timestamp: 1 }).then(messages => {
            if (messages) {
                res.json(messages)
            }
        })

    }


}