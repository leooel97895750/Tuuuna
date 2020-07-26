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

//輸入搜尋條件，輸出看板
router.get('/api/getclassboard', function(req, res, next) {
    
    pool.getConnection(function(err, connection){
        if(err){console.log(err); res.send('sql error');}
        querystr = "select c.* from class p, inheritance i, class c where p.CID=20 and p.CID=i.PCID and i.CCID=c.CID";
        connection.query(querystr, function(err, result){
            if(err){console.log(err); res.send('sql error');}
            res.send(result);
            connection.release();
        })
    });
    
});

module.exports = router;