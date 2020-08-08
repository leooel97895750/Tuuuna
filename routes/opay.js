let opay_payment = require('opay_payment_nodejs/lib/opay_payment.js');
let express = require('express');
let router = express.Router();

//金流測試
router.get('/api/opay', function(req, res, next) {
    //參數驗證(避免sql injection)
    let p1 = req.query.cid;
    console.log(p1);
    //參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
    //若要測試非必帶參數請將base_param內註解的參數依需求取消註解 //
    let base_param = {
        MerchantTradeNo: 'f0a0d7oeoie1mby2b193', //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
        MerchantTradeDate: '2020/08/08 16:00:00', //ex: 2017/02/13 15:45:30
        TotalAmount: '200',
        TradeDesc: 'tuuuna',
        ItemName: '測試商品',
        ReturnURL: 'https://www.tuuuna.com',
        // ChooseSubPayment: '',
        OrderResultURL: 'https://www.tuuuna.com',
        // NeedExtraPaidInfo: '1',
        // ClientBackURL: 'https://www.google.com',
        // ItemURL: 'http://item.test.tw',
        // Remark: '交易備註',
        // HoldTradeAMT: '1',
        // StoreID: '',
        // UseRedeem: ''
    };
    let create = new opay_payment();
    let htm = create.payment_client.aio_check_out_credit_onetime(parameters = base_param);
    console.log(htm);
    res.render('opay', {opayhtm: htm});
});

module.exports = router;