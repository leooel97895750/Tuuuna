//非同步API請求，傳入網址、回傳函式、jwt

function getAPI(url, callFun, token='noneed') {
    let xhttp;
    if (window.XMLHttpRequest) {
      // code for modern browsers
      xhttp = new XMLHttpRequest();
      } else {
      // code for IE6, IE5
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callFun(this);
      }
      //login api 請求限制觸發
      else if(this.readyState == 4 && this.status == 429) {
        alert('重複太多次了\n刷新網頁或5分鐘後再試試');
      }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('token', token);
    xhttp.send();
}

function postAPI(url, strArg, callFun, token='noneed') {
  let xhttp;
  if (window.XMLHttpRequest) {
    // code for modern browsers
    xhttp = new XMLHttpRequest();
    } else {
    // code for IE6, IE5
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callFun(this);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader('token', token);
  xhttp.send(strArg);
}