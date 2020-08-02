//article.ejs專用函式，留言
function sendMessage()
{
    //aid
    let articleaid = $("#content").attr("articleaid");
    //txt
    let txt = $("#message-txt").val();
    if(txt.trim() == '')alert('要打點東西喔');
    else
    {
        let getmember_url = "/api/getmember";
        getAPI(getmember_url, function(xhttp) {
            if(xhttp.responseText == 'authDenied') {islogin = 0;alert('登入才能留言喔');}
            else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
            else
            {
                let getmember_json = JSON.parse(xhttp.responseText);
                //author varchar(1000)
                let author = getmember_json[0].Name;
                //author_CID int
                let author_CID = getmember_json[0].CID;
                //author_IP varchar(1000) router取得

                let insertmessage_url = "/api/insertmessage?aid="+articleaid+"&txt="+txt+"&author="+author+"&author_CID="+author_CID;
                getAPI(insertmessage_url, function(xhttp){
                    if(xhttp.responseText == 'authDenied') {islogin = 0;alert('登入才能留言喔');}
                    else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
                    else
                    {
                        console.log(xhttp.responseText);
                        getMessage();
                        $("#message-txt").val('');
                    }
                }, getCookieByName('token'));
            }
        }, getCookieByName('token'));
    }
}