const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // request.body 가 객체로 인식

const mongoURI = process.env.LOCAL_DB_ADDRESS;
const port = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(() => console.log('mongoose connected'))
  .catch((err) => console.log('DB connection fail', err));

app.listen(port, () => {
  console.log('server on');
});
