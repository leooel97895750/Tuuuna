let express = require('express');
let router = express.Router();

//輸入cid 輸出class
router.post('/api/opayreturn', function(req, res, next) {
    //參數驗證(避免sql injection)
    console.log('???', req.body);
    
});

module.exports = router;