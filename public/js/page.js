var initDetailMask = function () {
    var wH = $(window).height();
    var infoH = $("#apiDetailInfo").height();
    var h = wH - infoH - 50;
    $("#apiDetailCode").height(h);
};
var addApi = function (title, description, path, method, code) {
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
            if (data.success) {
                $('#addApiModal').modal('hide');
                window.location.reload();
            }
        },
        fail: function (err, status) {
            console.log(err)
        }
    })
};
var editApi = function (title, description, path, orginalPath, method, orginalMethod, code) {
    $.ajax({
        type: "POST",
        url: "/editApi",
        dataType: "json",
        data: {
            title: title,
            description: description,
            path: path,
            orginalPath: orginalPath,
            method: method,
            orginalMethod: orginalMethod,
            code: code
        },
        success: function (data, status) {
            if (data.success) {
                $('#addApiModal').modal('hide');
                window.location.reload();
            }
        },
        fail: function (err, status) {
            console.log(err)
        }
    })
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
        var _attrList = $(this).parent(".oper-list");
        var method = _attrList.attr("data-method");
        var path = "/api" + _attrList.attr("data-path");
        $.ajax({
            type: method,
            url: path,
            dataType: "json",
            success: function (data, status) {
                $("#operApiWrap").show();
                $("#operApiWrap").attr("data-type", "modify");

                $("#operApiTitle").val(data.title);
                $("#operApiDesc").val(data.description);
                $("#operApiPath").val(data.path);
                $("#operApiOrginalPath").val(data.path);

                $("#operApiMethod").val(data.method);
                $("#operApiOrginalMethod").val(data.method);


                $("#operApiCode").val(JSON.stringify(data.response, null, 4));
                $('#operApiCode').keyup();
            },
            fail: function (err, status) {
                console.log(err)
            }
        })
    });
    $("#apiList").on("click", ".view-detail", function () {
        var _attrList = $(this).parent(".oper-list");
        var method = _attrList.attr("data-method");
        var path = "/api" + _attrList.attr("data-path");
        $.ajax({
            type: method,
            url: path,
            dataType: "json",
            success: function (data, status) {
                var info = [];
                info += '<p>标题：' + data.title + '</p>';
                info += '<p>描述：' + data.description + '</p>';
                info += '<p>方式：' + data.method + '</p>';
                info += '<p>地址：' + data.path + '</p>';
                $("#apiDetailInfo").html(info);
                $("#apiDetailCode pre").html(JSON.stringify(data.response, null, 4));
                $("#apiDetail").show();
            },
            fail: function (err, status) {
                console.log(err)
            }
        })
    });
    $("#apiList").on("click", ".delete-api", function () {
        var _attrList = $(this).parent(".oper-list");
        var title = _attrList.attr("data-title");
        var description = _attrList.attr("data-description");
        var method = _attrList.attr("data-method");
        var path = _attrList.attr("data-path");
        if (confirm("真的要删除吗？")) {
            $.ajax({
                type: "POST",
                url: "/deleteApi",
                dataType: "json",
                data: {
                    title: title,
                    description: description,
                    method: method,
                    path: path
                },
                success: function (data, status) {
                    console.log(data);
                    if (data.message) {
                        window.location.reload();
                    }
                },
                fail: function (err, status) {
                    console.log(err)
                }
            })
        }
    });
    $("#wantAddApi").on("click", function () {
        $("#operApiWrap").show();
        $("#operApiWrap").attr("data-type", "add");
    });
    // 隐藏hideOperApiWrap
    $("#hideOperApiWrap").on("click", function () {
        // TODO
        $("#operApiWrap").hide();
    });
    $("#confirmOperApiWrap").on("click", function () {
        var title = $("#operApiTitle").val().trim();
        var description = $("#operApiDesc").val().trim();
        var path = $("#operApiPath").val().trim();
        var method = $("#operApiMethod").val();
        var code = $("#operApiCode").val().trim();
        if ($("#operApiWrap").attr("data-type") == "add") {
            addApi(title, description, path, method, code);
        } else if ($("#operApiWrap").attr("data-type") == "modify") {
            var orginalPath = $("#operApiOrginalPath").val().trim();
            var orginalMethod = $("#operApiOrginalMethod").val().trim();

            editApi(title, description, path, orginalPath, method, orginalMethod, code);
        }
    });
});