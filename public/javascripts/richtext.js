function richText()
{
    let myeditor = document.getElementById('editor');
    let mytoolbar = document.getElementById('toolbar');
    var options = {
        modules: {
          toolbar: [
            // 工具列列表[註1]
            ['bold', 'italic', 'underline', 'strike'], // 粗體、斜體、底線和刪節線
            ['blockquote', 'code-block'], // 區塊、程式區塊
            [{ 'header': 1 }, { 'header': 2 }], // 標題1、標題2
            [{ 'list': 'ordered'}, { 'list': 'bullet' }], // 清單
            [{ 'script': 'sub'}, { 'script': 'super' }], // 上標、下標
            [{ 'indent': '-1'}, { 'indent': '+1' }], // 縮排
            [{ 'direction': 'rtl' }], // 文字方向
            [{ 'size': ['small', false, 'large', 'huge'] }], // 文字大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],// 標題
            [{ 'color': [] }, { 'background': [] }], // 顏色
            [{ 'font': [] }], // 字體
            [{ 'align': [] }], // 文字方向
            [ 'clean' ] // 清除文字格是
        ]
        },
        theme: 'snow'
      };
    var editor = new Quill(myeditor, options);
}
function getContent()
{
    //title varchar(1000)
    let title = $("#richtext-title").val();
    //txt text
    var txt = $('#editor .ql-editor').html();
    if(title == '')alert('要下標題喔');
    else if(txt == '<p><br></p>')alert('要寫內文喔');
    else
    {
        console.log(txt);
        //board_CID int
        let board_CID = $("#content").attr("boardcid");
        //`type` tinyint 板文=1、個板=2
        let type = 1;

        let getmember_url = "/api/getmember";
        getAPI(getmember_url, function(xhttp) {
            if(xhttp.responseText == 'authDenied') {islogin = 0;}
            else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
            else
            {
                let getmember_json = JSON.parse(xhttp.responseText);
                //author varchar(1000)
                let author = getmember_json[0].Name;
                //author_CID int
                let author_CID = getmember_json[0].CID;
                //author_IP varchar(1000) router取得

                let strArg = "title="+title+"&txt="+txt+"&board_CID="+board_CID+"&type="+type+"&author="+author+"&author_CID="+author_CID;
                let insertarticle_url = "/api/insertarticle";
                postAPI(insertarticle_url, strArg, function(xhttp) {
                    if(xhttp.responseText == 'authDenied') {islogin = 0;}
                    else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
                    else
                    {
                        console.log(xhttp.responseText);
                        openEditor();
                    }
                }, getCookieByName('token'));
                
            }
        }, getCookieByName('token'));
    }
}
function openEditor()
{
    $("#richtext-box").toggle();
    $("#content-box").toggle();
}