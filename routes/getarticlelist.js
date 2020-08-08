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

//輸入CID 輸出member table資料
router.get('/api/getarticlelist', function(req, res, next) {
    //參數驗證(避免sql injection)
    let p1 = req.query.cid;
    
    pool.getConnection(function(err, connection){
        if(err){console.log(err); res.send('sql error');}
        let myparams = [Number(p1)];
        let querystr = "select a.AID, a.`Type`, a.Since, a.Author, a.Title, a.Good, a.Bad, a.`Share`, a.Message, a.Watch from class c, co, object o, article a where c.CID=? and c.CID=co.CID and co.OID=o.OID and o.OID=a.AID";
        connection.query(querystr, myparams, function(err, result){
            if(err){console.log(err); res.send('sql error');}
            res.send(result);
            connection.release();
        })
    });
});

module.exports = router;