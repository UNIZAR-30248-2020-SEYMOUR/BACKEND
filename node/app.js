const express = require('express');
const fileupload = require("express-fileupload");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routerBackend = require('./routes/api_backend')
const bodyParser = require('body-parser');

const app = express();

app.use(fileupload());
app.use(cors({origin: '*', credentials: true,}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('', routerBackend)  // Without prefix
app.use('/videos', express.static(__dirname + '/videos')); // Videos directory


app.listen(process.env.API_PORT, '0.0.0.0', function () {
  console.log('Server listening at http://' + process.env.API_IP + ':' + process.env.API_PORT);
});

module.exports = app
