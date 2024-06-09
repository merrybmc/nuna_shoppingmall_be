import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import indexRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';

// dotenv.config();

require('dotenv').config();

const app = express();
const corsOption = {
  origin: ['http://localhost:3000', 'https://d3dlvbxpgesgac.cloudfront.net'],
  credentials: true,
};

app.use(cors(corsOption));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // request.body 가 객체로 인식
app.use(cookieParser());

app.use('/api', indexRouter);

const mongoURI = process.env.LOCAL_DB_ADDRESS;

// const port = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(() => console.log('mongoose connected'))
  .catch((err) => console.log('DB connection fail', err));

app.listen(process.env.PORT || 5000, () => {
  console.log('server on');
});
