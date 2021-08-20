const express = require( 'express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// setting ejs layouts and ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: false}));

// to use static files like imgs css, js files
app.use(express.static('public'));

// importing routes
const indexRouter = require('./routes/index');

// using the routes
app.use('/', indexRouter);

// setting and listening to ports
const PORT = process.env.PORT || 6000;
app.listen(PORT, ()=> console.log(`port is on ${PORT}`));