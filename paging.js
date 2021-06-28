var paging = function(){
    return{};
};
var pageSize = 4;
var pageNumber = 1;
var container = $('#imageDiv');
var baseURL = "https://imgbank.shopper360.com.my/synergyplus";
var options = {
    dataSource: null,
    pageSize : pageSize,
    showNavigator : true,
    formatNavigator: '<span style="color: #f00"><%= currentPage %></span> st/rd/th, <%= totalPage %> pages, <%= totalNumber %> entries',
    position: 'bottom',
    callback: function (response, pagination) {
        window.console && console.log(response);

        var dataHtml = '';

        $.each(response, function (index, item){
        dataHtml += '<div class="paging">'+
        '<a href="'+
            item.src+
        '"'+
        'data-lightbox="'+
        "image"+
        '"'+
        'data-title="'+
            item.name+
        '">'+
        '<img src = "' + 
            item.src +
        '"' + 
        '/>' +
        '</a>'+
        '<p>'+
            item.name +
        '</p>'+
        '</div>';
        });

        dataHtml += '';

        container.prev().html(dataHtml);
    }
};

paging.JS = (function(){
    return{
        init: function(){

            var processfile = $.ajax({
                type : 'POST',
                url : 'process.php',
                data:{
                        page_index : 0,
                        maxpagelimit : pageSize
                },
                dataType: "text",
            })
                .done(function(data){
                    var totalItem = JSON.parse(data).count;
                    var result = [];
                    var jdata = JSON.parse(data).data;

                    for(var i = 0;i<totalItem;i++){
                        if(i<jdata.length){
                            result.push(jdata[i]);
                        }
                        else{
                            result[i]= {Photo : "",
                                    Project_Outlet_Name: ""
                                    };
                        }
                    }
                        $.each(result, function(i,item){
                            result[i] = {
                                src : baseURL+item["Photo"],
                                name : item["Project_Outlet_Name"],
                            }
                        })
                        //$.pagination(container, options);

                        options.dataSource = result;

                        container.addHook('beforeInit', function () {
                        window.console && console.log('beforeInit...');
                        });
                        container.pagination(options);

                        container.addHook('beforePageOnClick', function (param) {
                            window.console && console.log('beforePageOnClick...');
                            console.log(param.currentTarget.outerText);
                            var pageIndex = (parseInt(param.currentTarget.outerText)-1)* 4;
                            pageNumber = parseInt(param.currentTarget.outerText);
                            updatePage(pageIndex,pageSize);
                            //return false
                        });

                        container.addHook('beforePreviousOnClick', function(param){
                            pageNumber-=1;
                            var pageIndex = (parseInt(pageNumber)-1)* 4;
                            updatePage(pageIndex,pageSize);
                        });

                        container.addHook('beforeNextOnClick', function(param){
                            pageNumber+=1;
                            var pageIndex = (parseInt(pageNumber)-1)* 4;
                            updatePage(pageIndex,pageSize);
                        });

                        function updatePage(pageIndex, pageSize){
                            console.log("UPDATE PAGE");
                            $.ajax({
                                type : 'POST',
                                url : 'process.php',
                                data:{
                                        page_index : pageIndex,
                                        maxpagelimit : pageSize
                                },
                                dataType: "text",
                                success: function(data){
                                    var datajson = JSON.parse(data).data;
                                datajson.map(function(item,i){
                                    result[pageIndex+i] = {
                                        src : baseURL+item["Photo"],
                                        name : item["Project_Outlet_Name"],
                                    }
                                })
                                console.log("RESULT",result);
                                options.dataSource = result;
                                container.pagination('show',options);
                                container.pagination('go', pageNumber);
                                }
                            })
                        }

                })
                .fail(function(){
                    alert("Error");
                })
                .always(function(){
                    console.log("IS THIS RUN");
                });
        }
    };
})();

(function () {
    jQuery(document).ready(function () {
      paging.JS.init();
    });
  })();