//article.ejs專用函式，留言
function sendMessage()
{
    //aid
    let articleaid = $("#content").attr("articleaid");
    //txt
    let txt = $("#message-txt").val();
    txt = textReplace(txt);
    if(txt.trim() == '')alert('要打點東西喔');
    else
    {
        let getmember_url = "/api/getmember";
        getAPI(getmember_url, function(xhttp) {
            if(xhttp.responseText == 'authDenied') {islogin = 0;alert('登入才能留言喔');}
            else
            {
                let getmember_json = JSON.parse(xhttp.responseText);
                //author varchar(1000)
                let author = getmember_json[0].Name;
                //author_CID int
                let author_CID = getmember_json[0].CID;
                //author_IP varchar(1000) router取得

                let insertmessage_url = "/api/insertmessage";
                let strArg = "aid="+articleaid+"&txt="+txt+"&author="+author+"&author_CID="+author_CID;
                postAPI(insertmessage_url, strArg, function(xhttp){
                    if(xhttp.responseText == 'authDenied') {islogin = 0;alert('登入才能留言喔');}
                    else
                    {
                        console.log(xhttp.responseText);
                        getMessage();
                        $("#message-txt").val('');
                        //更新article message數字
                        let strArg = "table=article&column=message&factor=AID&factorID="+articleaid+"&condition=plus";
                        let updatenumber_url = "/api/updatenumber";
                        postAPI(updatenumber_url, strArg, function(xhttp) {
                            if(xhttp.responseText == 'authDenied') {islogin = 0;}
                            console.log(xhttp.responseText);
                        }, getCookieByName('token'));
                    }
                }, getCookieByName('token'));
            }
        }, getCookieByName('token'));
    }
}