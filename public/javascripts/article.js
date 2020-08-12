function articleGood()
{
    //更新article Good數字
    //檢查有無按過讚
    let articleaid = $("#content").attr("articleaid");
    let getma_url = "/api/getma?aid="+articleaid;
    getAPI(getma_url, function(xhttp){
        if(xhttp.responseText == 'authDenied') {islogin = 0; alert('登入才能按讚喔');}
        let getma_json = JSON.parse(xhttp.responseText);
        //新增ma，插入按讚紀，
        if(getma_json[0] == undefined) goodBadOperation('Good', articleaid, '#article-good', 'good', 'plus');
        //更新ma good=1，插入按讚紀，
        else if(getma_json[0].Good == 0) goodBadOperation('Good', articleaid, '#article-good', 'good', 'plus');
        //更新ma good=0，收回讚，插入收回讚紀
        else goodBadOperation('Good', articleaid, '#article-good', 'good', 'minus');
    }, getCookieByName('token'));   
}
function articleBad()
{
    //更新article Bad數字
    //檢查有無按過噓
    let articleaid = $("#content").attr("articleaid");
    let getma_url = "/api/getma?aid="+articleaid;
    getAPI(getma_url, function(xhttp){
        if(xhttp.responseText == 'authDenied') {islogin = 0; alert('登入才能按讚喔');}
        let getma_json = JSON.parse(xhttp.responseText);
        //新增ma，插入按噓紀，
        if(getma_json[0] == undefined) goodBadOperation('Bad', articleaid, '#article-bad', 'bad', 'plus');
        //更新ma bad=1，插入按噓紀，
        else if(getma_json[0].Bad == 0) goodBadOperation('Bad', articleaid, '#article-bad', 'bad', 'plus');
        //更新ma bad=0，收回噓，插入收回噓紀
        else goodBadOperation('Bad', articleaid, '#article-bad', 'bad', 'minus');
    }, getCookieByName('token'));   
}

function goodBadOperation(mycolumn, articleaid, htmlid, myfactor, mycondition)
{
    let strArg = "table=article&column="+mycolumn+"&factor=AID&factorID="+articleaid+"&condition="+mycondition;
    let updatenumber_url = "/api/updatenumber";
    postAPI(updatenumber_url, strArg, function(xhttp) {
        if(xhttp.responseText == 'authDenied') {islogin = 0; alert('登入才能按讚喔');}
        if(mycondition == 'plus') {$(htmlid).text(Number($(htmlid).text()) + 1);}
        else {$(htmlid).text(Number($(htmlid).text()) - 1);}
    }, getCookieByName('token'));
    let insertma_url = "/api/insertma?aid="+articleaid+"&factor="+myfactor+"&condition="+mycondition;
    getAPI(insertma_url, function(xhttp) {
        if(xhttp.responseText == 'authDenied') {islogin = 0;}
    }, getCookieByName('token'));
}