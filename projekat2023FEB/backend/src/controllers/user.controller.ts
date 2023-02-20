import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import Workshop from '../models/workshop';
import User from '../models/user';
import SignUp from '../models/signUp';
import Message from '../models/Message';
import Comment from '../models/Comment';
import Like from '../models/Like';
import { ObjectId } from 'mongodb';
import Waitlist from '../models/Waitlist';

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

    getTop5 = (req: express.Request, res: express.Response) => {

        Like.aggregate([
            {
                $group: {
                    _id: "$workshop._id",
                    count: { $sum: 1 },
                    workshop: { $first: "$workshop" }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 5
            }
        ], function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result)
                // console.log(result);
            }
        });



    }

    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({ 'username': username, 'password': password }, (error, user) => {

            if
                (error) console.log(error);
            else {
                if (user) {
                    if (user.passwordDuration) {
                        if (new Date(user.passwordDuration) < new Date()) res.json({ 'resp': "expired" })
                        else res.json({ 'user': user });
                    }
                    else {
                        res.json({ 'user': user });
                    }
                }
                else { res.json({ 'user': user }); }
            }
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
                else if (dataName != "picture")
                    res.json({ "resp": "OK" })
            }
        );

        if (dataName == "password") {
            User.updateOne({ username: req.body.username },
                { $set: { passwordDuration: "" } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }

                })
        }

        if (dataName == "picture") {
            SignUp.updateMany({ username: req.body.username },
                { $set: { userPicture: newDataValue } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }

                })

            Message.updateMany({ 'sender.username': req.body.username },
                { $set: { 'sender.picture': newDataValue } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }
                })

            Comment.updateMany({ 'sender.username': req.body.username },
                { $set: { 'sender.picture': newDataValue } }, (error, success) => {
                    if (error) {
                        console.log(error);
                    }
                    else res.json({ "resp": "OK" })
                })
        }

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

    sendComment = (req: express.Request, res: express.Response) => {

        let comment = new Comment({
            workshop: req.body.workshop,
            sender: req.body.sender,
            content: req.body.content,
            timestamp: req.body.timestamp
        })

        comment.save().then(c => {
            if (c) res.json({ "resp": "OK" })
        })
    }


    getWorkshopComments = (req: express.Request, res: express.Response) => {
        let workshop = req.body.workshop

        Comment.find({ 'workshop._id': workshop._id }, (err, comments) => {
            if (err) console.log(err)
            else {
                res.json(comments)
            }
        })
    }


    likeWorkshop = (req: express.Request, res: express.Response) => {
        let workshop = req.body.workshop
        let user = req.body.user

        Like.findOne({ 'user.username': user.username, 'workshop._id': workshop._id }, (err, like) => {
            if (err) console.log(err)
            else if (like == null) {

                let like = new Like({
                    workshop: workshop,
                    user: user
                })

                like.save().then((resp) => {
                    res.json({ "resp": "OK" })
                })

            }
        })


    }

    unlikeWorkshop = (req: express.Request, res: express.Response) => {
        let workshop = req.body.workshop
        let user = req.body.user

        Like.deleteOne({ 'user.username': user.username, 'workshop._id': workshop._id }, (err, like) => {
            if (err) console.log(err)
            else
                res.json({ "resp": "OK" })
        })


    }

    likesOfWorkshop = (req: express.Request, res: express.Response) => {
        let workshop = req.body.workshop
        let user = req.body.user
        // console.log(workshop)

        Like.findOne({ 'user.username': user.username, 'workshop._id': workshop._id }, (err, like) => {
            if (err) console.log(err)
            else if (like == null) {
                Like.find({ 'workshop._id': workshop._id }, (err, likes) => {
                    if (err) console.log(err)
                    else res.json({ likes: likes, resp: "noUser" });

                })
            }
            else if (like != null) {
                Like.find({ 'workshop._id': workshop._id }, (err, likes) => {
                    if (err) console.log(err)
                    else res.json({ likes: likes, resp: "yesUser" });
                })
            }
        })
    }

    getAllUserLikedWorkshops = (req: express.Request, res: express.Response) => {

        Like.find({ 'user.username': req.body.username }, (err, likes) => {
            if (err) console.log(err)
            else res.json(likes)
        })
    }

    getAllUserComments = (req: express.Request, res: express.Response) => {

        Comment.find({ 'sender.username': req.body.username }, (err, comm) => {
            if (err) console.log(err)
            else res.json(comm)
        })
    }

    editComment = (req: express.Request, res: express.Response) => {
        let comment = req.body.comment

        Comment.updateOne(
            { _id: new ObjectId(comment._id) }
            ,
            {
                $set: { content: comment.content }
            }, (err, comm) => {
                if (err) console.log(err)
                else {
                    Comment.find({ 'sender.username': comment.sender.username }, (err, comms) => {
                        if (err) console.log(err)
                        else res.json(comms)
                    })
                }
            })
    }

    deleteComment = (req: express.Request, res: express.Response) => {
        let comment = req.body.comment

        Comment.deleteOne(
            { _id: new ObjectId(comment._id) }
            , (err, comm) => {
                if (err) console.log(err)
                else {
                    Comment.find({ 'sender.username': comment.sender.username }, (err, comms) => {
                        if (err) console.log(err)
                        else res.json(comms)
                    })
                }
            })
    }


    getMyMessages = (req: express.Request, res: express.Response) => {
        let sender = req.body.sender
        Message.aggregate([
            {
                $match: {
                    'sender.username': sender.username
                }
            },
            {
                $group: {
                    _id: '$workshop._id',
                    workshopName: { $first: '$workshop.name' },
                    workshopID: { $first: '$workshop._id' },
                    senderUsername: { $first: '$recipient.username' },
                    senderPicture: { $first: '$recipient.picture' }//ceo ovaj deo je predebilan i nema smisla sa imenima polja zbog glupe klase na frontu
                }
            }
        ], (err, messageRequests) => {
            if (err) console.log(err)
            else res.json(messageRequests)
        });
    }

    generatePassword() {
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialCharacters = '!@#$%^&*()_+-={}[]|\\:;<>,.?';

        const passwordLength = Math.floor(Math.random() * 9) + 8; // generates a random number between 8 and 16
        const firstChar = lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length)); // generates a random lowercase letter for the first character
        const remainingChars = passwordLength - 1;
        const remainingCharsTypes = [
            uppercaseLetters, // at least one uppercase letter
            numbers, // at least one number
            specialCharacters, // at least one special character
            lowercaseLetters
        ];

        let password = firstChar;

        for (let i = 0; i < remainingChars; i++) {
            const randomCharType = remainingCharsTypes[Math.floor(Math.random() * remainingCharsTypes.length)];
            const randomChar = randomCharType.charAt(Math.floor(Math.random() * randomCharType.length));
            password += randomChar;
        }

        return password;
    }



    generateNewPassword = (req: express.Request, res: express.Response) => {

        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) console.log(err)
            else {

                let duration: Date = new Date()
                duration.setTime(duration.getTime() + (30 * 60 * 1000))
                console.log(duration)

                if (user) {
                    let newPass = this.generatePassword()
                    console.log(newPass)

                    ///////////////////////////////////////////////////////////////////////////////
                    const nodemailer = require('nodemailer');

                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        service: 'outlook',
                        auth: {
                            user: 'artworkshop23@outlook.com',
                            pass: 'organizer123'
                        }
                    });
                    let mailOptions = {
                        from: 'Admin <artworkshop23@outlook.com>', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'NEW PASSWORD', // Subject line
                        text: 'NEW PASSWORD', // plain text body
                        html: '<h1 style="text-align: center;">New password for user: <strong>' + user.username + '</strong></h1><p style="color: red; font-weight: bold;">CAUTION:</p><p>' + newPass + '</p><p>This password is valid for 30minutes.</p>' // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            {
                                console.log("Mail OK")

                                User.updateOne({ username: user.username },
                                    { $set: { password: newPass, passwordDuration: duration } },
                                    { upsert: true }, (err, resp) => {
                                        if (err) console.log(err)
                                        else res.json({ "resp": "OK" })
                                    })
                            }
                        }
                    }
                    );
                }
                else res.json({ "resp": "noUser" })
            }
        })
    }

    withdrawSigUpRequst = (req: express.Request, res: express.Response) => {

        SignUp.deleteOne({ username: req.body.username, idWorkshop: req.body.idWorkshop }
            , (err, resp) => {
                if (err) console.log(err)
                else {
                    SignUp.find({ username: req.body.username }, (err, s) => {
                        if (err) console.log(err)
                        else res.json(s)
                    })
                }
            })
        let workshop;
        Workshop.findOne({ _id: new ObjectId(req.body.idWorkshop) }, (err, w) => {
            if (err) console.log(err)
            else {
                workshop = w;
                Workshop.updateOne({ _id: new ObjectId(req.body.idWorkshop) },
                    { $inc: { bookedPlaces: -1 } }, (err, resp) => {
                        if (err) console.log(err)
                        else {


                            Waitlist.find({ 'workshop._id': req.body.idWorkshop }, (err, users) => {
                                if (err) console.log(err)
                                else {
                                    if (users) {
                                        let emails = [];
                                        users.forEach(u => {
                                            emails.push(u.user.email)
                                        })


                                        /////////////////////////////////////////////////////////////////////////////////
                                        const nodemailer = require('nodemailer');

                                        // create reusable transporter object using the default SMTP transport
                                        let transporter = nodemailer.createTransport({
                                            service: 'outlook',
                                            auth: {
                                                user: 'artworkshop23@outlook.com',
                                                pass: 'organizer123'
                                            }
                                        });
                                        let mailOptions = {
                                            from: '"' + workshop.name + '" <artworkshop23@outlook.com>', // sender address
                                            to: emails, // list of receivers
                                            subject: 'FREE SPOT', // Subject line
                                            text: 'Cancellation', // plain text body
                                            html: '<h1 style="text-align: center; color: green;">SPOT HAS BEEN FREED in workshop <strong>' + workshop.name + '</strong></h1><p>This workshop has one more place, hurry up.</p>' // html body
                                        };

                                        // send mail with defined transport object
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                                console.log(error);
                                            }
                                            else {
                                                console.log("Mail OK")
                                                res.json({ "resp": "OK" })
                                            }
                                        }
                                        );



                                    }
                                }
                            })

                        }
                    })
            }
        })



    }


    waitlistForWorkshop = (req: express.Request, res: express.Response) => {
        let user = req.body.user
        let workshop = req.body.workshop
        Waitlist.findOne({ "user.username": user.username, "workshop._id": workshop._id }, (err, user) => {
            if (err) console.log(err)
            else if (user) res.json({ "resp": "already" })
            else {
                let waitlist = new Waitlist({
                    user: req.body.user,
                    workshop: req.body.workshop
                })

                waitlist.save().then(w => {
                    if (w) res.json({ "resp": "OK" })
                })
            }
        })

    }

}