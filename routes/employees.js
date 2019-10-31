var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');

const { check, validationResult,sanitizeBody  } = require('express-validator');
 
 



/* GET All */
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM employee',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })        
});

//GET BY ID
//employee/1
router.get('/:id', function(req, res, next) {
    connection.query('SELECT * FROM employee WHERE EmpID =? ',[req.params.id],(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })        
});

// DELETE EMPLOYEE
router.delete('/:id', function(req, res, next) {     
    connection.query('DELETE FROM employee WHERE EmpID = ?', [req.params.id], function(err, result) {
        //if(err) throw err
        if (!err) {
            res.send("Deleted success");
        } else {
            res.send(err);
        }
    })
})

// for validate in CREATE / UPDATE 
const validateEmployee = [

    check('name').exists().not().isEmpty().trim().escape(),
    check('empcode').not().isEmpty().trim().escape().isLength({ min: 5 , max:5 }).custom((value, { req }) => {
        if (!value.startsWith("EMP")  ) {
          throw new Error('Empcode much start with EMP');
        }
        return true;
      })
       ,
    check('salary').not().isEmpty().trim().escape()
    .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    // .matches(/\d/).withMessage('must contain a number')
    .matches(/^\d+$/).withMessage('must be only number')
    ,
    sanitizeBody('notifyOnReply').toBoolean()
  ] ;

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `[${param}]: ${msg}`;
}; 

//INSERT EMPLOYEE

// {
// 	"name":"pok2",
// 	"empcode" : "EMP92",
// 	"salary": "12244"
// }


router.post('/', validateEmployee
  , function(req, res, next) {     
    // const errors = validationResult(req)
    //express-validator  
    //default error response
    // {
    //     "value": "92",
    //     "msg": "Invalid value",
    //     "param": "empcode",
    //     "location": "body"
    // },
  
    const errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var resData = {
        name: req.body.name,
        empcode: req.body.empcode,
        salary: req.body.salary
    }

    connection.query(`INSERT INTO employee (Name,EmpCode,Salary) VALUES (?,?,?)`, [resData.name,resData.empcode,resData.salary] , function(err, result) {
        if (!err) {
            resData.EmpID = result.insertId;
            res.send(resData);
        } else {
            res.send(err);
        }
    })
        

   
})

//UPDATE EMPLOYEE
router.put('/:id', validateEmployee , function(req, res, next) { 
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var resData = {
        name: req.body.name,
        empcode: req.body.empcode,
        salary: req.body.salary
    }

    connection.query(`UPDATE employee
                    SET
                    Name = ? ,
                    EmpCode = ? ,
                    Salary = ? 
                    WHERE EmpId = ?;`, [resData.name,resData.empcode,resData.salary,req.params.id] , function(err, result) {
        //if(err) throw err
        if (!err) {
            console.log(result);
            //resData.EmpID = result.insertId;
            res.send(resData);
        } else {
            res.send(err);
        }
    })
})
 
module.exports = router;