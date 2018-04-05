const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./router/index');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '/../public')));

app.use('/', router);

module.exports = app;