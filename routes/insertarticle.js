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

//輸入sp_insertarticle需要的參數
router.post('/api/insertarticle', function(req, res, next) {

    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            
            let p1 = req.body.title;
            let p2 = req.body.txt;
            let p3 = req.body.board_CID;
            let p4 = req.body.type;
            let p5 = req.body.author;
            let p6 = req.body.author_CID;
            let p7 = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

            pool.getConnection(function(err, connection){
                if(err){console.log(err); res.send('sql error');}
                let myparams = [Number(p3), Number(p4), p5, Number(p6), p7, p1, p2];
                let querystr = "call sp_insertarticle(?, ?, ?, ?, ?, ?, ?)";
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

