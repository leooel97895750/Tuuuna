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

//存入使用者頭像圖片id
router.get('/api/updatememberimg', function(req, res, next) {

    //jwt驗證(避免無權限者使用api)
    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            //參數驗證(避免sql injection)
            let p1 = decoded.mymid;
            let p2 = req.query.imgurl;
            let p3 = req.query.imgid;
            
            pool.getConnection(function(err, connection){
                if(err){console.log(err); res.send('sql error');}
                let myparams = [p2, p3, Number(p1)];
                let querystr = "update `member` set Img = ?, Imgid = ? where MID=?";
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

