let express = require('express');
let router = express.Router();
const sqlregex = /[;-\s\n\b'/"!`#}!{$&})(=+*|]/;

//用看板的cid進入看板首頁，取得預覽的20筆文章
router.get('/board/:boardcid/article/:articleaid', function(req, res, next) {
    //參數驗證(避免sql injection)
    let p1 = req.params.boardcid;
    let p2 = req.params.articleaid;
    if(sqlregex.test(p1) == false && sqlregex.test(p2) == false)
    {
        res.render('article', {
            boardcid: p1,
            articleaid: p2
        });
    }
    else
    {
        res.send('sqlregex fail');
        console.log('board: sqlregex fail');
    }
});

module.exports = router;