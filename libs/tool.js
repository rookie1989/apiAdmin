/*
 * 工具
 * Author：Rookie
 * creatTs：2017-12-03
 */

var tool = {
    getFilePath: function (url, method) {
        var prefix = '/api';
        var str = url.trim().replace(prefix, "");
        if (str.substr(str.length - 1, 1) == "/") {
            var formatUrl = str.substring(0, str.length - 1);
        } else {
            var formatUrl = str;
        }
        var filePath = "./resource/" + method + formatUrl.replace(/\//g, '.') + ".json";
        return filePath;
    },
};
module.exports = tool;