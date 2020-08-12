require('dotenv').config();
let mysql = require('mysql');
//update帳號權限須包含update、select權限
let pool = mysql.createPool({
  host : process.env.HOST,
  user : process.env.USER_U,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  multipleStatements: false
});
let express = require('express');
let router = express.Router();

//更新觀看數值 +1
router.post('/api/updatenumber_free', function(req, res, next) {

    //參數驗證(避免sql injection)
    let p1 = req.body.factorID;
    
    pool.getConnection(function(err, connection){
        if(err){console.log(err); res.send('sql error');}
        let myparams = [Number(p1)];
        let querystr = "update article set Watch = Watch + 1 where AID=?";
        connection.query(querystr, myparams, function(err, result){
            if(err){console.log(err); res.send('sql error');}
            res.send(result);
            connection.release();
        })
    });
});

module.exports = router;

