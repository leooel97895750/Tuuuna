require('dotenv').config();
let mysql = require('mysql');
let pool = mysql.createPool({
  host : process.env.HOST,
  user : process.env.USER_S,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  multipleStatements: false
});
let express = require('express');
let router = express.Router();

//輸入AID 輸出message
router.get('/api/getmessage', function(req, res, next) {
    //參數驗證(避免sql injection)
    let p1 = req.query.aid;
    
    pool.getConnection(function(err, connection){
        if(err){console.log(err); res.send('sql error');}
        let myparams = [Number(p1)];
        let querystr = "select * from message where AID=?";
        connection.query(querystr, myparams, function(err, result){
            if(err){console.log(err); res.send('sql error');}
            res.send(result);
            connection.release();
        })
    });
});

module.exports = router;