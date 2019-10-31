var connection  = require('../lib/db');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const saltRounds = 10;


module.exports = {
 create: function(req, res, next) {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var resData = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds)
    }
    connection.query(`INSERT INTO users (name,email,password) VALUES (?,?,?)`, [resData.name,resData.email,resData.password] , function(err, result) {
        if (!err) {
            resData.id = result.insertId;  
            res.send({status: "success", message: "User added successfully!!!", data: resData} );
        } else {
            // res.send(err);
            next(err);
        }
    })

 },
authenticate: function(req, res, next) {
    connection.query('SELECT * FROM users WHERE email= ? limit 1 ',[req.body.email],(err,rows,fields)=>{
        if(err)
            next(err);
        else{
            
            if(bcrypt.compareSync( req.body.password  , rows[0].password)) {
                const token = jwt.sign({id: rows.id}, req.app.get('secretKey'), { expiresIn: '1h' });
                res.send({status:"success", message: "user found!!!", data:{user: rows, token:token}});
            }else{
                res.send({status:"error", message: "Invalid email/password!!!", data:null});
            }
        }  
    })
 },
}