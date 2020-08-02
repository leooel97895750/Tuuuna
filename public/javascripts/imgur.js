//上傳圖片到imgur，並將產生的圖片id存入資料庫
//參數: inputFile id、x(寬度)、y(高度)
function uploadCutImg(htmlid, x, y)
{
    let mywidth = Number(x);
    let myheight = Number(y);
    let fileUploader = document.getElementById(htmlid).files[0];
    if(fileUploader == undefined) alert('還沒選圖片喔');
    else
    {
        //console.log(fileUploader);
        let uploadCrop;
        let reader = new FileReader(); 
        reader.readAsDataURL(fileUploader); 
        reader.onload = function (e) { 
            uploadCrop.croppie('bind', { 
                url: e.target.result 
            }); 
        }
        
        $("#img-cut").css("display", "block");
        uploadCrop = $('#img-cut-view').croppie({ 
            viewport: { 
                width: mywidth, 
                height: myheight
            }, 
            boundary: { 
                width: mywidth+100, 
                height: myheight+100
            },
            showZoomer: false
        }); 
        $('#uploadimg-cut').on('click', function (ev) {
            uploadCrop.croppie('result', {
                type: 'base64',
                size: {width: mywidth, height: myheight},
                format: 'jpeg'
            }).then(function (resp) {
                $("#img-cut").css("display", "none");
                $('#uploadimg-cut').off('click');
                //console.log(resp);
                let imgbase64 = resp.replace('data:image/jpeg;base64,', '');
        
                let form = new FormData();
                form.append("image", imgbase64);
                form.append("title", fileUploader.name); 
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
                    uploadCrop.croppie('destroy');
                    let updatememberimg_url = "/api/updatememberimg?imgurl="+response_json.data.link+"&imgid="+response_json.data.id;
                    getAPI(updatememberimg_url, function(xhttp){
                        if(xhttp.responseText == 'authDenied') {alert('請重新登入');}
                        else if(xhttp.responseText == 'sqlregex fail') {alert('資料包含特殊字元');}
                        else alert('上傳成功');
                        getmemberData();
                    }, getCookieByName('token'));
                });
                
            });
        });
    }
}
function uploadImg(htmlid)
{
    
    let fileUploader = document.getElementById(htmlid).files[0];
    console.log(fileUploader);
    if(fileUploader == undefined) alert('還沒選圖片喔');
    else
    {
        let form = new FormData();
        form.append("image", fileUploader);
        form.append("title", fileUploader.name); 
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
            console.log(response_json);
        });
    }
}
//透過圖片id查詢圖片詳細資料
function downloadImg()
{
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.imgur.com/3/image/dClK8mt",
        "method": "GET",
        "headers": {
          "authorization": "Bearer c63a2f30ade6aaca739bb43c57298963aa002550",
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response.data);
    });
}
//回傳年月日
function getDayTime() 
{
    let date = new Date();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
}
//回傳年月日時分秒
function getSecTime()
{
    let date = new Date();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let hh = date.getHours(); 
    let mi = date.getMinutes(); 
    let ss = date.getSeconds();

    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd, (hh > 9 ? '' : '0') + hh, (mi > 9 ? '' : '0') + mi, (ss > 9 ? '' : '0') + ss].join('');
}

function uploadMemberImg()
{
    $("#uploadimg-box").slideToggle();
}