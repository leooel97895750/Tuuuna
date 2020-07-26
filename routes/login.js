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
const sqlregex = /[;-\s\n\b'/"!`#}!{$&})(=+*|]/;
let rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 限制時間
    max: 5, // 限制請求數量
    message: '登入太多次了，5分鐘後再試試'
})

//傳入mailhash, pwdhash，登入帳號，回傳jwt
router.get('/api/login', limiter, function(req, res, next) {

    pool.getConnection(function(err, connection){
        if(err){console.log(err); res.send('sql error');}
        //api參數regex檢查
        const p1 = req.query.mailhash;
        const p2 = req.query.pwdhash;
        if(sqlregex.test(p1) == false && sqlregex.test(p2) == false)
        {
            querystr = "select CID, MID from `member` where Mail_hash='"+p1+"' and Pwd='"+p2+"'";
            connection.query(querystr, function(err, result){
                if(err){console.log(err); res.send('sql error');}
                if(result[0] == undefined) res.send('login fail');
                else
                {
                    const token = jwt.sign({'mycid': result[0].CID, 'mymid': result[0].MID}, secret, { expiresIn: '1 day' });
                    res.send(token);
                }
                connection.release();
            })
        }
        else
        {
            res.send('sqlregex fail');
            console.log('login: sqlregex fail');
        } 
    });
});

module.exports = router;

