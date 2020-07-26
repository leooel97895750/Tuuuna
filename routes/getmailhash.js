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
const sqlregex = /[;-\s\n\b'/"!`#}!{$&})(=+*|]/;

//傳入mail_hash，回傳查詢結果
router.get('/api/getmailhash', function(req, res, next) {

    let p1 = req.query.mail_hash;
    if(sqlregex.test(p1) == false)
    {
        pool.getConnection(function(err, connection){
            if(err){console.log(err); res.send('sql error');}
            querystr = "select Mail_hash from `member` where Mail_hash='"+p1+"'";
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
        console.log('getmailhash: sqlregex fail');
    } 
});

module.exports = router;

