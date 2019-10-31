const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { check } = require('express-validator');
var connection  = require('../lib/db');

const validateUser = [
    check('name').exists().not().isEmpty().trim().escape()
    , check('email').exists().not().isEmpty().trim().escape()
      .isEmail().withMessage('must be an email')
      .custom((value, { req }) => {
          return new Promise( ( resolve, reject ) => {
              connection.query('SELECT  * FROM users WHERE email= ?  LIMIT 1 ; ',[req.body.email],(err,rows,fields)=>{
                  if ( rows.length >0 )
                      return reject( "already has email" );
                  resolve();
              } );
          } );
      })
    
    , check('password').not().isEmpty().trim().escape()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage('must be upper case letter, an lowercase letter, a number')
  ] ;


router.post('/register', validateUser , userController.create);
router.post('/authenticate', userController.authenticate);
module.exports = router;