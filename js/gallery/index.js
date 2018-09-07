/*define index.html js(data+paging handling)*/
//record:pager number
if (typeof (Storage) !== 'undefined') {
    if (window.sessionStorage["session"] !== 'undefined') {
        if (window.sessionStorage["session"] == 'teafiftycloud') {            
        } else {
            window.sessionStorage["session"] = 'teafiftycloud';
        }
    } else {
        window.sessionStorage["session"] = 'teafiftycloud';
    }            
} else {
    //when browser not support
}

//album data deduct blocklist data
//ref:http://tsangprogramlearning.blogspot.tw/2014/04/jqueryremove-item-from-json-array.html
/*albumdata: picasa all data(json type) 
  blocklist: self-defined not showing data(json type)
  compare  : after replace all blank & trim, compare the album title name(so should note album's name)
  return   : albumdata deduct blocklist(json type)
 */
function jsonConduct(albumdata,blocklist) {
    var result = albumdata.feed.entry;    
    for (j = 0; j < blocklist.length; j++)
    {        
        var blockitem = blocklist[j]["title"].trim().replace(/\s+/g, "");
        for (i = 0; i < result.length; i++)
        {                        
            if (result[i].media$group.media$title.$t.trim().replace(/\s+/g, "") === blockitem) {
                result.splice(i, 1);   //移除當筆資料起始的共一筆資料
            }
        }        
    }    
    return result;
}

//view 
var url = "https://picasaweb.google.com/data/feed/api/user/105491382522976985520?alt=json";     //album data
var blockurl = "https://script.google.com/macros/s/AKfycbxxu_OMluR8sKUk05oszbITShnHd4JX5M-RIyISpDZ1Csub2Zs/exec";   //block list data
jQuery.getJSON(url).success(function (data) {
    var pagedata = 0;    
    //add galleryPage to set backbutton behavior(it should be set before the vue works)
    if (window.sessionStorage["galleryPage"] !== undefined) {
        pagedata = parseInt(window.sessionStorage["galleryPage"]);
        //add gallerydifPage to set paging button css
        if (window.sessionStorage["difPage"] !== undefined) {
            z = parseInt(window.sessionStorage["difPage"]);
            if (pagedata > 0) {
                document.getElementById("tfirst").style.cursor = "pointer";
                document.getElementById("tfirst").style.color = "black";
                document.getElementById("tfirst").style.pointerEvents = "auto";
                if (z >= 0 && z <= 1) {     //middle                    
                    document.getElementById("tlast").style.cursor = "default";
                    document.getElementById("tlast").style.color = "#ddd";
                    document.getElementById("tlast").style.pointerEvents = "none";
                } else {    //end                    
                    document.getElementById("tlast").style.cursor = "pointer";
                    document.getElementById("tlast").style.color = "black";
                    document.getElementById("tlast").style.pointerEvents = "auto";
                }
            }
        }
    }

    //get block list & do json compare => to get newer json
    $.get(blockurl, function () { })
    .done(function (ldata) {
        var resultdata = jsonConduct(data, JSON.parse(ldata));
        getView(resultdata, pagedata);  //vue generate
    })
    .fail(function () {
        getView(data.feed.entry, pagedata);     //if block data get failed, show all picasa data
    });
    
}).error(function (message) {
    console.error('error' + message);
}).complete(function () {
    //include shared html file    
    $.get("shared/footer.html", function (data) {
        $("#footersc").html(data);
    });

});

$(document).ajaxStop(function () {    
});

var getView = function (data, pagedata) {
    new Vue({
        el: '#albumdata',
        data: {
            albums: data,//data.feed.entry,
            pageurl: 'phdetail.html?albumid=',
            searchKey: '',      /*pagingation*/
            currentPage: pagedata,
            itemsPerPage: 20,
            resultCount: 0            
        },
        computed: {
            totalPages: function () {                
                return Math.ceil(this.resultCount / this.itemsPerPage)
            }
        },
        methods: {
            coverurl: function (e) {                
                var boxss = [];
                boxss = e.split("/");
                var resulturl = "";
                for (var i = 0; i < boxss.length; i++) {
                    if (i == boxss.length - 1) {
                        resulturl += "s240/";   //add size
                    }
                    resulturl += boxss[i];
                    if (i == boxss.length - 1) { }
                    else {
                        resulturl += "/";
                    }
                }                
                return resulturl;
            },            
            setPage: function (pageNumber) {                
                this.currentPage = pageNumber;
                window.sessionStorage["galleryPage"] = pageNumber;
                var dif = this.totalPages - pageNumber;
                window.sessionStorage["difPage"] = dif;
                if (pageNumber == 0) {
                    document.getElementById("tfirst").style.cursor = "default";
                    document.getElementById("tfirst").style.color = "#ddd";
                    document.getElementById("tfirst").style.pointerEvents = "none";
                    document.getElementById("tlast").style.cursor = "pointer";
                    document.getElementById("tlast").style.color = "black";
                    document.getElementById("tlast").style.pointerEvents = "auto";
                } else {
                    document.getElementById("tfirst").style.cursor = "pointer";
                    document.getElementById("tfirst").style.color = "black";
                    document.getElementById("tfirst").style.pointerEvents = "auto";
                    if (dif >= 0 && dif <= 1) {     //middle                        
                        document.getElementById("tlast").style.cursor = "default";
                        document.getElementById("tlast").style.color = "#ddd";
                        document.getElementById("tlast").style.pointerEvents = "none";
                    } else {    //end                        
                        document.getElementById("tlast").style.cursor = "pointer";
                        document.getElementById("tlast").style.color = "black";
                        document.getElementById("tlast").style.pointerEvents = "auto";
                    }
                }

            }
        },
        filters: {
            paginate: function (list) {
                this.resultCount = list.length; 
                if (this.currentPage >= this.totalPages) {
                    this.currentPage = this.totalPages - 1
                }
                var index = this.currentPage * this.itemsPerPage
                return list.slice(index, index + this.itemsPerPage)
            }
        }
    });
}


