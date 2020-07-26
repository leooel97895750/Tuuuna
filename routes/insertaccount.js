require('dotenv').config();
let mysql = require('mysql');
let pool = mysql.createPool({
  host : process.env.HOST,
  user : process.env.USER_SP,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  multipleStatements: false
});
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const sqlregex = /[;-\s\n\b'/"!`#}!{$&})(=+*|]/;

//從信箱的驗證信啟用，資料庫中產生帳號
router.get('/api/insertaccount', function(req, res, next) {

    jwt.verify(req.query.token, secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            let p1 = decoded.gmail;
            let p2 = decoded.mail_hash;
            let p3 = decoded.pwd_hash;
            let p4 = decoded.name;
            if(sqlregex.test(p1) == false && sqlregex.test(p2) == false && sqlregex.test(p3) == false && sqlregex.test(p4) == false)
            {
                pool.getConnection(function(err, connection){
                    if(err){console.log(err); res.send('sql error');}
                    querystr = "call sp_register('" +p1+ "','" +p2+ "','" +p3+ "','" +p4+ "')";
                    connection.query(querystr, function(err, result){
                        if(err){console.log(err); res.send('sql error');}
                        let resstr = '<script>alert("帳號成功開通!");document.location.href="https://www.tuuuna.com";</script>';
                        if(result[0][0].alreadyExist != undefined) {res.send(resstr);}
                        else {res.send(resstr);}
                        connection.release();
                    })
                });
            }
            else
            {
                res.send('你的資料中包含特殊字元，因此無法開通');
                console.log('insertaccount: sqlregex fail');
            }
        }
    });
});

module.exports = router;

