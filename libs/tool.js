/*
 * 工具
 * Author：Rookie
 * creatTs：2017-12-03
 */

var tool = {
    formatUrl: function(url) {
        var prefix='/api';
        var str = url.trim().replace(prefix, "");
        if (str.substr(str.length - 1, 1) == "/") {
            var formatUrl = str.substring(0, str.length - 1);
        } else {
            var formatUrl = str;
        }
        return formatUrl;
    }
};
module.exports = tool;