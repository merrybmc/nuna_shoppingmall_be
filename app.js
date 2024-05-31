import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import indexRouter from './routes/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // request.body 가 객체로 인식

app.use('/api', indexRouter);
const mongoURI = process.env.LOCAL_DB_ADDRESS;
const port = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(() => console.log('mongoose connected'))
  .catch((err) => console.log('DB connection fail', err));

app.listen(port, () => {
  console.log('server on');
});
