let editor;
function richText()
{
    let myeditor = document.getElementById('editor');
    let mytoolbar = document.getElementById('toolbar');
    var options = {
        modules: {
            toolbar: {
                container:
                    [['image', 'link'],
                    ['bold', 'italic', 'underline', 'strike'], // 粗體、斜體、底線和刪節線
                    [{ 'size': ['small', false, 'large', 'huge'] }], // 文字大小
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],// 標題
                    [{ 'color': [] }, { 'background': [] }], // 顏色
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }], // 清單
                    ['code-block']] // 區塊、程式區塊
            }
        },
        placeholder: '內容...',
        theme: 'snow'
      };
    editor = new Quill(myeditor, options);
    editor.getModule('toolbar').addHandler('image', () => {
        imageHandler();
    });
}
//將原本image的處理改成 => 先進行圖片大小處理 => 將base64資料上傳imgur api => 回傳url顯示於rich text中
function imageHandler()
{
    //點擊quill toolbar中的image icon
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    input.onchange = () => {
        //當載入圖片後，進行大小處理
        const inputimage = input.files[0];
        let reader = new FileReader();
        //抓取圖片大小
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        let mywidth;
        let myheight;
        let defaultwidth;
        let defaultheight;
        img.onload = function() {
            myheight = this.height;
            mywidth = this.width;
            defaultheight = this.height;
            defaultwidth = this.width;
            $("#image-size-image").css('width', mywidth+'px');
            $("#image-size-image").css('height', myheight+'px');
        };
        img.src = _URL.createObjectURL(inputimage);
        //瀏覽器上顯示圖片
        reader.readAsDataURL(inputimage);
        reader.onload=function(e) {
            let imgFile = e.target.result;
            $("#image-size-image").attr('src', imgFile);
        }
        
        $("#image-size").css('display', 'block');
        //綁定放大
        $("#image-big").on('click', function(ev){
            if((mywidth * 1.1) <= defaultwidth)
            {
                mywidth = mywidth * 1.1;
                myheight = myheight * 1.1;
                $("#image-size-image").css('width', mywidth+'px');
                $("#image-size-image").css('height', myheight+'px');
            }
            else alert('已經是最大了');
        });
        //綁定縮小
        $("#image-small").on('click', function(ev){
            mywidth = mywidth * 0.9;
            myheight = myheight * 0.9;
            $("#image-size-image").css('width', mywidth+'px');
            $("#image-size-image").css('height', myheight+'px');
        });

        $('#image-size-upload').on('click', function (ev) {
            $("#image-size").css('display', 'none');
            //post至imgur
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let img = document.getElementById('image-size-image');
            canvas.width = mywidth;
            canvas.height = myheight;
            context.drawImage(img, 0, 0, Number(mywidth), Number(myheight));
            let canvasdata = canvas.toDataURL('image/jpeg');
            
            let form = new FormData();
            form.append("image", canvasdata.replace('data:image/jpeg;base64,', ''));
            form.append("title", inputimage.name); 
            form.append("description", getSecTime()); 
            
            let settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://api.imgur.com/3/image",
                "method": "POST",
                "headers": {
                "authorization": "Bearer c63a2f30ade6aaca739bb43c57298963aa002550",
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": form
            };

            $.ajax(settings).done(function (response) {
                let response_json = JSON.parse(response);
                editor.insertEmbed(editor.getSelection(), 'image', response_json.data.link);
                $('#image-size-upload').off('click');
                $("#image-big").off('click');
                $("#image-small").off('click');
            });
                
            
        });    
        
    };
}
//board.ejs專用函式，發文
function tryContent()
{
    console.log(editor.getContents());
    console.log(editor.getText());
    console.log($('#editor .ql-editor').html());
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
            if(xhttp.responseText == 'authDenied') {islogin = 0;alert('登入才能發文喔');}
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
                        getBoardArticle();
                        openEditor();
                        $("#richtext-title").val('');
                        $('#editor .ql-editor').html('');
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