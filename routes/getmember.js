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
let jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

//輸入CID 輸出member table資料
router.get('/api/getmember', function(req, res, next) {

    //jwt驗證(避免無權限者使用api)
    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            //參數驗證(避免sql injection)
            let p1 = decoded.mymid;
            
            pool.getConnection(function(err, connection){
                if(err){console.log(err); res.send('sql error');}
                let myparams = [Number(p1)];
                let querystr = "select MID, Name, CDes, Img, Mail, Since, LastModifyDT, Sex, Phone, Birthday, Address, FriendsNum, CID from `member` where MID=?";
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

