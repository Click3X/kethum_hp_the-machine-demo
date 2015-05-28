/* App Configuration */
var app = {
    routes:{
        image_upload:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/uploadImageFromSrc",
        image_list:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/getImageList",
        image_path:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/getImageFullPath/",
        search:{
            hadoop:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByHadoopWithTracking/",
            naive:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByNaive/",
            lsh:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByLSH/"
        },
        cancel_hadoop:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/cancel/hadoop/",
        register:"https://sirius-2.hpl.hp.com:8443/ImageSearchService/user/submitEmail/"
    }
}

/* utils */
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

/*----- Avoid `console` errors -------*/
var method, noop = function () {},
methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
], length = methods.length,
console = (window.console = window.console || {});

while (length--){
    method = methods[length];
    if (!console[method]) console[method] = noop;
}

/*----- add object keys if needed-------*/
if(!Object.keys) {
  Object.keys = function(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }
    return keys;
  };
}

/*----- disable pointer events on scroll-------*/
var scrolltimer;

window.addEventListener('scroll', function(){
    clearTimeout(scrolltimer);

    if(document.body.className.indexOf('disable-hover') == -1) {
        document.body.className += ' disable-hover';
    }

    scrolltimer = setTimeout(function(){
        var classes = document.body.className.split(" ");
        for(var i = 0; i<classes.length; i++){
            if( classes[i] == 'disable-hover' )
                classes.splice(i,1);
        }
        document.body.className = classes.join(" ");
    },200);
}, false);

/*--------email validation---------*/
function validateemail(email){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

/*--------set default pop window parameters---------*/
function openpopup(url, title, w, h){
    // Fixes dual-screen position Most browsers Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - h) + dualScreenTop;
    var newWindow = window.open(url, escape(title), 'scrollbars=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if( window.focus ) newWindow.focus();
}