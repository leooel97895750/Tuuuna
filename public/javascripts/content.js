//index.html專用函式
function getBoard()
{
    let getclassboard_url = '/api/getclassboard';
    getAPI(getclassboard_url, function(xhttp){
        let getclassboard_json = JSON.parse(xhttp.responseText);
        console.log(getclassboard_json);
        //神一般的引號使用技術，小心觸碰
        $("#content-list").empty();
        for(let i=getclassboard_json.length-1; i>=0; i--)
        {
            let eachBoard = $("<li onclick='"+'window.location="https://www.tuuuna.com/board/'+getclassboard_json[i].CID+'"'+";'>"+
                            "<span style='font-size:20px;'>"+getclassboard_json[i].CName+" "+
                            "<span style='font-size:16px;margin-left:10px;'>"+((getclassboard_json[i].CDes == null) ? '' : getclassboard_json[i].CDes)+"</span>"+
                            "</span></li>");
            $("#content-list").prepend(eachBoard);
        }
    });
}
//board.ejs專用函式，透過ejs綁定在content上的cid來抓取資料
let nowPage = 0;
let listNum = 0;
//滾輪偵測
let scrollLock = 0;
function scrollDetect()
{
    $(window).scroll(function(){
        if(scrollLock == 0)
        {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if(Math.abs((scrollTop + windowHeight) - scrollHeight) <= 15){
                //鎖住滾輪偵測
                scrollLock = 1;
                nowPage = nowPage + 1;
                getBoardArticleNext(nowPage);
            }
        }
    });
}
//下頁文章加載
function getBoardArticleNext(page)
{
    let boardcid = $("#content").attr("boardcid");
    let getarticlelist_url = '/api/getarticlelist?cid='+boardcid+'&page='+page*10;
    getAPI(getarticlelist_url, function(xhttp){
        let getarticlelist_json = JSON.parse(xhttp.responseText);
        console.log(getarticlelist_json);
        //神一般的引號使用技術，小心觸碰
        for(let i=0; i<getarticlelist_json.length; i++)
        {
            listNum = listNum + 1;
            let articlecolor;
            let articlewatch = Number(getarticlelist_json[i].Watch);
            if(articlewatch < 10) articlecolor = 'green';
            else if(articlewatch < 50) articlecolor = 'yellow';
            else if(articlewatch < 100) articlecolor = 'dodgerblue';
            else if(articlewatch < 150) articlecolor = 'Fuchsia';
            else articlecolor = 'red';
            let eachBoard = $("<li style='padding:10px;' onmouseup='boardCookie()'>"+
                            "<a href='https://www.tuuuna.com/board/"+boardcid+"/article/"+getarticlelist_json[i].AID+"'>"+
                            "<span style='color:"+articlecolor+"; position: absolute; font-size: 20px;'>"+
                            "<span style='position: absolute; top:-10px; left:-10px; color: lightgray; font-size: 10px;'>#"+listNum+"</span>"+
                            "<span style='position: absolute; top:10px; left:-5px;'>"+getarticlelist_json[i].Watch+"</span>"+
                            "</span>"+
                            "<div style='margin-left: 40px;'>"+
                            "<span style='font-size:20px;'>"+getarticlelist_json[i].Title+"</span><br>"+              
                            "<span style='color:#4cc381'>留言</span>"+getarticlelist_json[i].Message+" "+
                            "<span style='color:#4cc381'>讚</span>"+getarticlelist_json[i].Good+" "+
                            "<span style='color:#4cc381'>噓</span>"+getarticlelist_json[i].Bad+" "+
                            "<span style='color:#4cc381'>分享</span>"+getarticlelist_json[i].Share+" "+
                            "<span style='position: absolute; right: 10px;'>"+
                            getarticlelist_json[i].Author+" "+
                            getarticlelist_json[i].Since.split('.')[0].replace('T', ' ')+"</span>"+
                            "</div>"+
                            "</a>"+
                            "</li>");
            $("#content-list").append(eachBoard);
        }
        //解鎖滾輪偵測
        scrollLock = 0;
    });
}
//紀錄文章列表位置
function boardCookie()
{
    console.log(nowPage);
    console.log(listNum);
}
//board.ejs、article.ejs專用函式，取得標題
function getBoardTitle()
{
    let boardcid = $("#content").attr("boardcid");
    let getclass_url = '/api/getclass?cid='+boardcid;
    getAPI(getclass_url, function(xhttp){
        let getclass_json = JSON.parse(xhttp.responseText);
        console.log(getclass_json);
        $("#content-title").html("<a href='https://www.tuuuna.com'>Tuuuna 討論區</a> >> <a href='https://www.tuuuna.com/board/"+boardcid+"'>"+getclass_json[0].CName+"</a>");
    });
}

//article.ejs專用函式，取得文章
function getArticle()
{
    let articleaid = $("#content").attr("articleaid");
    let getarticle_url = '/api/getarticle?aid='+articleaid;
    getAPI(getarticle_url, function(xhttp){
        let getarticle_json = JSON.parse(xhttp.responseText);
        console.log(getarticle_json);
        $("#article-title").text(getarticle_json[0].Title);
        $("#article-author").text(getarticle_json[0].Author+" "+getarticle_json[0].Since.split('.')[0].replace('T', ' '));
        $("#article-content").html(getarticle_json[0].Txt);
        $("#article-good").text(getarticle_json[0].Good);
        $("#article-bad").text(getarticle_json[0].Bad);
        //更新article Watch數字
        let strArg = "factorID="+articleaid;
        let updatenumber_free_url = "/api/updatenumber_free";
        postAPI(updatenumber_free_url, strArg, function(xhttp) {
            if(xhttp.responseText == 'authDenied') {islogin = 0;}
            console.log(xhttp.responseText);
        });
    });
}

//article.ejs專用函式，取得留言
function getMessage()
{
    let articleaid = $("#content").attr("articleaid");
    let getmessage_url = '/api/getmessage?aid='+articleaid;
    getAPI(getmessage_url, function(xhttp){
        let getmessage_json = JSON.parse(xhttp.responseText);
        console.log(getmessage_json);
        //神一般的引號使用技術，小心觸碰
        $("#message-list").empty();
        for(let i=getmessage_json.length-1; i>=0; i--)
        {
            let eachMessage = $("<li>"+
                            "<span style='color:#eeee00;'>"+getmessage_json[i].Author+"</span>"+": "+
                            getmessage_json[i].Txt+
                            "<div style='float:right;'>"+getmessage_json[i].Since.split('.')[0].replace('T', ' ')+"</div>"+
                            "</li>");
            $("#message-list").prepend(eachMessage);
        }
    });
}