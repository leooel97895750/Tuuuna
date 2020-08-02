require('dotenv').config();
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const sqlregex = /[;-\s\n\b'/"!`#}!{$&})(=+*|]/;
let nodemailer = require('nodemailer');
let rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 限制時間
    max: 3, // 限制請求數量
    message: '註冊太多次了，5分鐘後再試試'
})

//傳入使用者gmail, 寄帳號驗證信給使用者
router.get('/api/sendmail', limiter, function(req, res, next) {

    //api參數regex檢查
    let p1 = req.query.gmail;
    let p2 = req.query.mail_hash;
    let p3 = req.query.pwd_hash;
    let p4 = req.query.name;
    if(sqlregex.test(p1) == false && sqlregex.test(p2) == false && sqlregex.test(p3) == false && sqlregex.test(p4) == false)
    {
        const token = jwt.sign({'gmail': p1, 'mail_hash': p2, 'pwd_hash': p3, 'name': p4}, secret, { expiresIn: '10 min' });
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            secureConnection: true,
            auth: {
                user: 'leo97895750@gmail.com',
                pass: '9789575leooel0'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        let options = {
            //寄件者
            from: '"Tuuuna" <leo97895750@gmail.com>',
            //收件者
            to: req.query.gmail, 
            //主旨
            subject: 'Tuuuna帳號驗證信',
            //嵌入 html 的內文
            html: '<h2>感謝您註冊會員</h2><h3>點擊下方按鈕完成最後帳號開通驗證程序</h3><a href="https://www.tuuuna.com/api/insertaccount?token='+token+'">>>帳號開通<<</a><p>注意: 10分鐘後連結將失效</p>'
        };
        
        //發送信件方法
        transporter.sendMail(options, function(error, info){
            if(error){
                res.send('mail fail');
                console.log('nodemailer錯誤: ', error);
            }else{
                res.send('mail success');
                console.log('nodemailer訊息發送: ' + info.response);
            }
        });
    }
    else
    {
        res.send('sqlregex fail');
        console.log('sendmail: sqlregex fail');
    } 
});

module.exports = router;

