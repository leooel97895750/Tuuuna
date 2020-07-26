//1. 註冊介面轉換
//1.1. 登入頭像、背景黑屏轉換、帳戶資料
let islogin = 0;
function pressLogin() 
{
    //1.1.1. 開啟登入介面
    if(islogin == 0)
    {
        if($("#signup-box").css('display') == 'none' && $("#login-box").css('display') == 'none')
        {
            $("#login-box").slideDown();
            $("#dark-mask").css('display', 'block');
        }
        else
        {
            $("#signup-box").slideUp();
            $("#login-box").slideUp();
            $("#dark-mask").css('display', 'none');
        }
    }
    //1.1.2. 開啟帳戶資料頁面
    else
    {
        $("#member-box").slideToggle();
        $("#dark-mask").toggle();
    }
}
//1.2. 登入註冊按鈕
function toLogin()
{
    $("#signup-box").css('display', 'none');
    $("#login-box").slideDown();
}
function toSignup()
{
    $("#login-box").css('display', 'none');
    $("#signup-box").slideDown();
}

function register()
{
    //2. 獲取登入資料
    let newmail = $("#newmail").val();
    let newpassword = $("#newpassword").val();
    let againpassword = $("#againpassword").val();
    let newname = $("#newname").val();
    if(newmail == '' || newpassword == '' || againpassword == '' || newname == '') alert('尚有未填寫資料喔');
    else if(/[;-\s\n\b'/"!`#}!{$&})(=+*|]/.test(newmail) == true) alert('信箱不能含有@以外的特殊字元喔');
    else if(newpassword.length <= 6) alert('密碼要大於6位比較安全喔');
    else if(/[;-\s\n\b'/"!`#}!{$&})(=+*|]/.test(newpassword) == true) alert('不能含有特殊字元喔');
    else if(newpassword != againpassword) alert('密碼確認不一致喔');
    else
    {
        //2.1. 檢查Mail_hash是否重複
        let mail_hash = hex_sha1(newmail);
        let getmailhash_url = "/api/getmailhash?mail_hash="+mail_hash;
        getAPI(getmailhash_url, function(xhttp){
            if(xhttp.responseText == 'authDenied') {alert('請重新登入');islogin = 0;}
            else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
            else
            {
                let getmailhash_json = JSON.parse(xhttp.responseText);
                if(getmailhash_json[0] != undefined) alert('此信箱已註冊');
                else
                {
                    //2.2. server寄信至信箱驗證
                    //2.3. 信箱網址開通帳號並寫入資料庫
                    alert('驗證信已寄至信箱\n請至信箱查看並開通帳號');
                    let pwd_hash = hex_sha1(newpassword);
                    let sendmail_url = "/api/sendmail?gmail="+newmail+"&mail_hash="+mail_hash+"&pwd_hash="+pwd_hash+"&name="+newname;
                    getAPI(sendmail_url, function(xhttp){
                        if(xhttp.responseText == 'authDenied') {alert('請重新登入');islogin = 0;}
                        else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
                        else if(xhttp.responseText == 'mail fail') {alert('系統錯誤請稍後再試');}
                    });  
                    $("#signup-box").slideUp();
                    $("#dark-mask").css('display', 'none');
                }
            }
        });
    }
    
}

//3. 登入
function login()
{
    let myaccount = $("#myaccount").val();
    let mypassword = $("#mypassword").val();
    if(myaccount == '' || mypassword == '') alert('尚有未填寫資料');
    else
    {
        let mail_hash = hex_sha1(myaccount);
        let pwd_hash = hex_sha1(mypassword);
        loginAPI(mail_hash, pwd_hash);
    }
}
//3.1
function loginAPI(mail_hash, pwd_hash)
{
    let login_url = "/api/login?mailhash="+mail_hash+"&pwdhash="+pwd_hash;
    getAPI(login_url, function(xhttp){
        if(xhttp.responseText == 'authDenied') {alert('請重新登入');islogin = 0;}
        else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
        else if(xhttp.responseText == 'login fail') {alert('帳號密碼錯誤');}
        else
        {
            //3.1.1. 登入成功，取得jwt存入cookie
            document.cookie = 'token=' + xhttp.responseText + '; path=/';
            $("#login-box").slideUp();
            $("#dark-mask").css('display', 'none');
            getmemberData();
        }
    });
}

//3.1.2. 根據token取得使用者資料，成功則islogin=1;
function getmemberData()
{
    let getmember_url = "/api/getmember";
    getAPI(getmember_url, function(xhttp) {
        if(xhttp.responseText == 'authDenied') {islogin = 0;}
        else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
        else
        {
            let getmember_json = JSON.parse(xhttp.responseText);
            $("#member-name").text(getmember_json[0].Name);
            $("#member-mail").text(getmember_json[0].Mail);
            $("#login").attr('src', getmember_json[0].Img);
            islogin = 1;
        }
    }, getCookieByName('token'));
}

//4. 登出
function logout()
{
    islogin = 0;
    //path避免不同路徑下同名的cookie產生兩個
    document.cookie = 'token=; path=/';
    $("#login").attr('src', '/images/member.png');
    $("#member-box").slideToggle();
    $("#dark-mask").toggle();
}