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

    let p1 = req.query.mailhash;
    let p2 = req.query.pwdhash;

    pool.getConnection(function(err, connection){
        if(err){console.log(err); res.send('sql error');}
        
        
        let myparams = [p1, p2];
        let querystr = "select CID, MID from `member` where Mail_hash=? and Pwd=?";
        connection.query(querystr, myparams, function(err, result){
            if(err){console.log(err); res.send('sql error');}
            if(result[0] == undefined) res.send('login fail');
            else
            {
                const token = jwt.sign({'mycid': result[0].CID, 'mymid': result[0].MID}, secret, { expiresIn: '7 day' });
                res.send(token);
            }
            connection.release();
        })
    });
});

module.exports = router;

