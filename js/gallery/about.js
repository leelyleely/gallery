/*define about.html js(data handling)*/

$().ready(function () {
    //include shared view    
    $.get("shared/footer.html", function (data) {
        $("#footersc").html(data);
    });

    //form validation
    $(function () {
        $("#commentform").validate();
    });

    jQuery.validator.addMethod("noSpace", function (value, element) {
        //return value.indexOf(" ") < 0 && value != "";        
        if ((value.replace(/(^[\s]*)|([\s]*$)/g, "")).length == 0)
            return false;
        else
            return true;
    }, "不可輸入空白");

    var frmValidate = $('#commentform').validate({
        rules: {
            iptname: {
                required: true,
                noSpace: true,
                minlength: 3,
                maxlength: 20
            },
            ipturl: {
                required: true,
                noSpace: true,
                email: true                
            },
            iptcomment: {
                required: true,
                noSpace: true,
                minlength: 5,
                maxlength: 250
            }
        },
        messages: {
            iptname: {
                required: "不輸入不知道您是誰喔 ⊙︿⊙",
                minlength: "請至少輸入3個字",
                maxlength: "胃太小只吃的下20個字喔 ⊙︿⊙"
            },
            ipturl: {
                required: "不輸入找不到您喔 ⊙︿⊙",
                email: "格式不正確喔"                
            },
            iptcomment: {
                required: "不輸入不知道您要說甚麼喔",
                minlength: "請至少輸入5個字",
                maxlength: "胃太小只吃的下250個字喔 ⊙︿⊙"
            }
        }
    });

    //back to index
    $("#backhome").click(function () {
	window.location.href='index.html';
    });
	
    //contact data insert
    $("#sendout").click(function () {                        
        var chkResult = frmValidate.form();
        //alert(chkResult);
        if (chkResult) {
            $.blockUI({
                message: "<div style='font-size:25px;'>請稍待...</div>"                
            });
            //get ip
            $.getJSON("https://jsonip.com/?callback=?", function (data) {
                //console.log(data.ip);

                //ip重複check
                $.get("https://script.google.com/macros/s/AKfycbwGAI2UhoNE8TP7LCcQrv-l5rcojuIa5t3G5VXj8bkP8W9ZAPgX/exec", { "logip": data.ip }, function (dbdata) {                    
                    if (dbdata.indexOf("true") == 0)
                    {
                        $.unblockUI({
                            onUnblock: function () { alert("您已於一小時內留言五次，請稍後再留言.. "); }
                        });                        
                    }                    
                    else
                    {                       
                        //insert db
                        $.get("https://script.google.com/macros/s/AKfycbwseQroFl2BvVR3aurhtMG8THlUFH6nhW7HkXbeEdW-aD511YI/exec", {
                            "logip": data.ip,
                            "name": $("#cname").val(),
                            "email": $("#curl").val(),
                            "message": $("#ccomment").val()
                        }, function (returndata) {
                            if (returndata.indexOf("true") == 0) {
                                $.unblockUI({
                                    onUnblock: function () { alert('謝謝您，訊息已成功送出！  (*￣∇￣*)'); }
                                });
                                
                                //清除表單
                                $('#commentform')[0].reset();
                            } else {
                                //alert("Sorry，這個功能壞掉了，管理員會盡快處理.. ");
								$.unblockUI({
									onUnblock: function () { alert("Sorry，這個功能壞掉了，管理員會盡快處理.. "); }
								});
                            }
                        });
                    }
                    
                });                                

            });            
        }
    });
    
});

