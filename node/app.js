const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routerBackend = require('./routes/api_backend')


// App configuration
const app = express();

app.use(cors({origin: '*', credentials: true,}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('', routerBackend)  // Without prefix


app.listen(process.env.API_PORT, function () {
  console.log('Server listening at http://' + process.env.API_IP + ':' + process.env.API_PORT);
});

module.exports = app
