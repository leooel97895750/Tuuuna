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

//輸入sp_insertarticle需要的參數
router.post('/api/insertarticle', function(req, res, next) {

    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            
            const p1 = req.body.title;
            const p2 = req.body.txt;
            const p3 = req.body.board_CID;
            const p4 = req.body.type;
            const p5 = req.body.author;
            const p6 = req.body.author_CID;
            const p7 = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            console.log(p1);
            console.log(p2);
            console.log(p3);
            console.log(p4);
            console.log(p5);
            console.log(p6);
            console.log(p7);
            if(sqlregex.test(p1) == false && sqlregex.test(p3) == false && sqlregex.test(p4) == false && sqlregex.test(p5) == false && sqlregex.test(p6) == false)
            {
                pool.getConnection(function(err, connection){
                    if(err){console.log(err); res.send('sql error');}
                    querystr = "call sp_insertarticle("+p3+","+p4+",'"+p5+"',"+p6+",'"+p7+"','"+p1+"','"+p2+"')";
                    console.log(querystr);
                    connection.query(querystr, function(err, result){
                        if(err){console.log(err); res.send('sql error');}
                        res.send(result);
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

