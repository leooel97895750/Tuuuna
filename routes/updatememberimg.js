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
const sqlregex = /[;-\s\n\b'"!`#}!{$&})(=+*|]/;

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
            if(sqlregex.test(p1) == false && sqlregex.test(p2) == false && sqlregex.test(p3) == false)
            {
                pool.getConnection(function(err, connection){
                    if(err){console.log(err); res.send('sql error');}
                    querystr = "update `member` set Img = '"+p2+"', Imgid = '"+p3+"' where MID="+p1;
                    connection.query(querystr, function(err, result){
                        if(err){console.log(err); res.send('sql error');}
                        res.send(result);
                        connection.release();
                    })
                });
            }
            else
            {
                res.send('sqlregex fail');
                console.log('updatememberimg: sqlregex fail');
            } 
        }
    });
});

module.exports = router;

