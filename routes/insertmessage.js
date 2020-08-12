require('dotenv').config();
let mysql = require('mysql');
let pool = mysql.createPool({
  host : process.env.HOST,
  user : process.env.USER_I,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  multipleStatements: false
});
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

//輸入message table需要的參數
router.post('/api/insertmessage', function(req, res, next) {

    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            
            let p1 = req.body.aid;
            let p2 = req.body.txt;
            console.log(p2);
            let p3 = req.body.author;
            let p4 = req.body.author_CID;
            let p5 = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            
            pool.getConnection(function(err, connection){
                if(err){console.log(err); res.send('sql error');}
                let myparams = [Number(p1), p3, Number(p4), p5, p2];
                let querystr = "insert into message(AID, Author, Author_CID, Author_IP, Txt) values(?, ?, ?, ?, ?)";
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

