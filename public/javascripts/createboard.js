function createBoard()
{
    $("#content-box").toggle();
    $("#create-box").toggle();
}
function insertBoard()
{
    let boardname = $("#board-name").val();
    let boarddes = $("#board-des").val();
    if(boardname.trim() == '' || boarddes.trim() == '')alert('要打點字喔');
    else if(boardname.length > 25)alert('看板名字太長喔');
    else if(boarddes.length > 40)alert('看板介紹太長喔');
    else
    {
        let insertboard_url = "/api/insertboard?cname="+boardname+"&cdes="+boarddes;
        getAPI(insertboard_url, function(xhttp){
            if(xhttp.responseText == 'authDenied') {islogin = 0;alert('登入才能創板喔');}
            else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
            else
            {
                console.log(xhttp.responseText);
                alert('看板創立成功');
                $("#board-name").val('');
                $("#board-des").val('');
                getBoard();
                createBoard();
            }
        }, getCookieByName('token'));
    }
}