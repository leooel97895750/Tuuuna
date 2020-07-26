//透過key值搜尋cookie中的value

function parseCookie() {
    let cookieObj = {};
    let cookieAry = document.cookie.split(';');
    let cookie;
    
    for (let i=0, l=cookieAry.length; i<l; ++i) {
        cookie = jQuery.trim(cookieAry[i]);
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }  
    return cookieObj;
}

function getCookieByName(name) {
    let value = parseCookie()[name];
    if (value) {
        value = decodeURIComponent(value);
    }
    return value;
}