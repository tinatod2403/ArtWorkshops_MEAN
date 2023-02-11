import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import userRouter from './routers/user.routers';
import organizerRouter from './routers/organizer.routers';


const app = express();

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 500000 }))
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/ArtWorkshop');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("DB connection ok")
})

const router = express.Router();
router.use('/user', userRouter);
router.use('/organizer', organizerRouter);

app.use('/', router);

app.listen(4000, () => console.log(`Express server running on port 4000`));