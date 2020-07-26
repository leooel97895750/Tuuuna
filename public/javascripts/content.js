//index.html專用函式
function getBoard()
{
    let getclassboard_url = '/api/getclassboard?test=123';
    getAPI(getclassboard_url, function(xhttp){
        let getclassboard_json = JSON.parse(xhttp.responseText);
        console.log(getclassboard_json);
        //神一般的引號使用技術，小心觸碰
        for(let i=getclassboard_json.length-1; i>=0; i--)
        {
            let eachBoard = $("<li onclick='"+'window.location="https://www.tuuuna.com/board/'+getclassboard_json[i].CID+'"'+";'>"+
                            "<span style='font-size:20px;'>"+getclassboard_json[i].CName+" "+
                            getclassboard_json[i].CDes+
                            "</span></li>");
            $("#content-list").prepend(eachBoard);
        }
    });
}
//board.ejs專用函式，透過ejs綁定在content上的cid來抓取資料
function getBoardArticle()
{
    let boardcid = $("#content").attr("boardcid");
    let getarticlelist_url = '/api/getarticlelist?cid='+boardcid;
    getAPI(getarticlelist_url, function(xhttp){
        let getarticlelist_json = JSON.parse(xhttp.responseText);
        console.log(getarticlelist_json);
        //神一般的引號使用技術，小心觸碰
        for(let i=getarticlelist_json.length-1; i>=0; i--)
        {
            let eachBoard = $("<li onclick='"+'window.location="https://www.tuuuna.com/board/'+boardcid+'/article/'+getarticlelist_json[i].AID+'"'+";'>"+
                            "<span style='font-size:20px;'>"+getarticlelist_json[i].Title+"</span><br>"+                
                            getarticlelist_json[i].Message+" "+
                            getarticlelist_json[i].Good+" "+
                            getarticlelist_json[i].Bad+" "+
                            getarticlelist_json[i].Share+"<span style='float:right;'>"+
                            getarticlelist_json[i].Author+" "+
                            getarticlelist_json[i].Since.split('.')[0].replace('T', ' ')+"</span>"+
                            
                            "</li>");
            $("#content-list").prepend(eachBoard);
        }
    });
}
//board.ejs、article.ejs專用函式，取得標題
function getBoardTitle()
{
    let boardcid = $("#content").attr("boardcid");
    let getclass_url = '/api/getclass?cid='+boardcid;
    getAPI(getclass_url, function(xhttp){
        let getclass_json = JSON.parse(xhttp.responseText);
        console.log(getclass_json);
        $("#content-title").text("Tuuuna 討論區 >> "+getclass_json[0].CName);
    });
}

//article.ejs專用函式，取得文章
function getArticle()
{
    let articlecid = $("#content").attr("articlecid");
    let getarticle_url = '/api/getarticle?cid='+articlecid;
    getAPI(getarticle_url, function(xhttp){
        let getarticle_json = JSON.parse(xhttp.responseText);
        console.log(getarticle_json);
        $("#article-title").text(getarticle_json[0].Title);
        $("#article-author").text(getarticle_json[0].Author+" "+getarticle_json[0].Since.split('.')[0].replace('T', ' '));
        $("#article-content").html(getarticle_json[0].Txt);
    });
}