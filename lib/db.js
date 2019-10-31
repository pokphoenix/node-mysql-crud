var mysql=require('mysql');
var connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'node_mysql_crud',
  multipleStatements:true
});


connection.connect((err)=>{
    if(!err){
        console.log('MySQL Connected!:)');
    }else{
        console.log('MySQL Connected Fail \n'+ JSON.stringify(err,undefined,2));
    }
});  
connection.query("SET sql_mode = 'STRICT_TRANS_TABLES'");
module.exports = connection; 