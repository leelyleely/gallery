/*define phdetail.html js(data handling) */

//include shared html file
$.get("shared/footer.html", function (data) {
    $("#footersc").html(data);
});

//getQueryString by name
function getQueryStringByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//view
var albumid = getQueryStringByName('albumid');
var url = "https://picasaweb.google.com/data/feed/api/user/105491382522976985520/albumid/" + albumid + "?alt=json";

jQuery.getJSON(url).success(function (data) {    
    new Vue({
        el: '#gallery',
        data: {
            photos: data.feed.entry
        },
        methods: {
            singleurl: function (e) {
                var boxss = [];
                boxss = e.split("/");
                var resulturl = "";
                for (var i = 0; i < boxss.length; i++) {
                    if (i == boxss.length - 1) {
                        resulturl += "s1920/";   //add size(original size< this size will be ambigious
                    }
                    resulturl += boxss[i];
                    if (i == boxss.length - 1) { }
                    else {
                        resulturl += "/";
                    }
                }

                return resulturl;
            }
        }
    });
}).error(function (message) {
    console.error('error' + message);
}).complete(function () {
    //jgallery 
    $(function () {
        $('#gallery').jGallery({ backgroundColor: 'black', mode: 'full-screen', textColor: 'white', height: '100vh', canChangeMode: false });
    });
});

