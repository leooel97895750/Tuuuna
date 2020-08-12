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

//
router.get('/api/insertma', function(req, res, next) {

    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            let p1 = decoded.mymid;
            let p2 = req.query.aid;
            let p3 = req.query.factor;
            let p4 = req.query.condition;
            
            pool.getConnection(function(err, connection){
                if(err){console.log(err); res.send('sql error');}
                let myparams = [Number(p1), Number(p2), p3, p4];
                let querystr = "call sp_insertMA(?, ?, ?, ?)";
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