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
let jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

//更新資料數值 +1 (table, column, factor, id)
router.post('/api/updatenumber', function(req, res, next) {

    //jwt驗證(避免無權限者使用api)
    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            //參數驗證(避免sql injection)
            let p1 = req.body.table;
            let p2 = req.body.column;
            let p3 = req.body.factor;
            let p4 = req.body.factorID;
            let p5 = req.body.condition;
            
            pool.getConnection(function(err, connection){
                if(err){console.log(err); res.send('sql error');}
                let myparams = [p1, p2, p2, p3, Number(p4)];
                let querystr;
                if(p5 == 'plus') {querystr = "update ?? set ?? = ?? + 1 where ??=?";}
                else {querystr = "update ?? set ?? = ?? - 1 where ??=?";}
                connection.query(querystr, myparams, function(err, result){
                    if(err){console.log(err); res.send('sql error');}
                    res.send(result);
                    connection.release();
                })
            });
        }
    });
});

module.exports = router;

