var initDetailMask = function () {
    var wH = $(window).height();
    var infoH = $("#apiDetailInfo").height();
    var h = wH - infoH-50;
    $("#apiDetailCode").height(h);
}
$(function () {
    // initDetailMask();
    // $(window).resize(function () {
    //     initDetailMask();
    // });
    document.addEventListener('keydown', function (e) {
        if ($("#apiDetail").is(":visible")) {
            e = e || window.event;
            if (e.keyCode == 27) {
                $("#apiDetail").hide();
                e.preventDefault();
                return false;
            }
        }
    }, false);
    $("#apiList").on("click", ".edit-api", function () {
        $.ajax({
            type: "POST",
            url: "/editApi",
            dataType: "json",
            data: {
                url: "intention.orders.infos",
                name: "rookie",
            },
            success: function (data, status) {
                console.log(data)
            },
            fail: function (err, status) {
                console.log(err)
            }
        })
    });
    $("#apiList").on("click", ".view-detail", function () {
        var method = $(this).attr("data-method");
        var path = "/api" + $(this).attr("data-path");
        $.ajax({
            type: method,
            url: path,
            dataType: "json",
            success: function (data, status) {
                var info=[];
                info+='<p>标题：'+data.title+'</p>';
                info+='<p>描述：'+data.description+'</p>';
                info+='<p>方式：'+data.method+'</p>';
                info+='<p>地址：'+data.path+'</p>';
                $("#apiDetailInfo").html(info);
                $("#apiDetailCode pre").html(JSON.stringify(data.response, null, 4));
                $("#apiDetail").show();
            },
            fail: function (err, status) {
                console.log(err)
            }
        })
    });
    $("#addApiBtn").on("click", function () {
        var title = $("#addApiTitle").val().trim();
        var description = $("#addApiDesc").val().trim();
        var path = $("#addApiPath").val().trim();
        var method = $("#addApiMethod").val();
        var code = $("#addApiCode").val().trim();

        $.ajax({
            type: "POST",
            url: "/addApi",
            dataType: "json",
            data: {
                title: title,
                description: description,
                path: path,
                method: method,
                code: code
            },
            success: function (data, status) {
                console.log(data)
            },
            fail: function (err, status) {
                console.log(err)
            }
        })
    });
});