
var connection  = require('./lib/db');
const express = require('express');
const logger = require('morgan');
var app = express();
const bodyparser = require('body-parser');

var employeesRouter = require('./routes/employees');
const users = require('./routes/users');
var jwt = require('jsonwebtoken');

app.set('secretKey', 'nodeRestApi'); // jwt secret token


app.use(logger('dev'));
app.use(bodyparser.json());



app.get('/', function(req, res){
    res.json({"tutorial" : "Build REST API with node.js"});
});

// public route
app.use('/users', users);

// private route
// access by send x-access-token in header 

app.use('/employees', employeesRouter);


function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey')
        , function(err, decoded) {
            if (err) {
                res.send({status:"error", message: err.message, data:null});
            }else{
                // add user id to request
                req.body.userId = decoded.id;
                next();
            }
    });    
}

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function(err, req, res, next) {
    console.log(err);
    if(err.status === 404)
      res.status(404).json({message: "Not found"});
    else 
       res.status(500).json({message: "Something looks wrong :( !!!"});
});

app.listen(3000,()=> console.log("node is running at port no : 3000 ") );
