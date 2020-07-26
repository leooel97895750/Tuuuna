let express = require('express');
let router = express.Router();
const sqlregex = /[;-\s\n\b'/"!`#}!{$&})(=+*|]/;

//用看板的cid進入看板首頁，取得預覽的20筆文章
router.get('/board/:boardcid', function(req, res, next) {
    //參數驗證(避免sql injection)
    let p1 = req.params.boardcid;
    if(sqlregex.test(p1) == false)
    {
        res.render('board', {
            boardcid: p1
        });
    }
    else
    {
        res.send('sqlregex fail');
        console.log('board: sqlregex fail');
    }
});

module.exports = router;