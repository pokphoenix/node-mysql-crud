
var connection  = require('./lib/db');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

var employeesRouter = require('./routes/employees');


app.use(bodyparser.json());


app.listen(3000,()=> console.log("node is running at port no : 3000 ") );

app.use('/employees', employeesRouter);
