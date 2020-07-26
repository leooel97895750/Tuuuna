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

//輸入CID 輸出member table資料
router.get('/api/getarticle', function(req, res, next) {
    //參數驗證(避免sql injection)
    let p1 = req.query.cid;
    if(sqlregex.test(p1) == false)
    {
        pool.getConnection(function(err, connection){
            if(err){console.log(err); res.send('sql error');}
            querystr = "select * from article where AID="+p1;
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
        console.log('getarticle: sqlregex fail');
    } 
});

module.exports = router;