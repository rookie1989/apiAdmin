/*
 * 工具
 * Author：Rookie
 * creatTs：2017-12-03
 */
var tool = {
    formatUrl: function(url) {
        var str = url.trim().replace(prefix, "");
        // url=/intention/orders/infos

        if (str.substr(str.length - 1, 1) == "/") {
            var formatUrl = url.substring(0, basic.length - 1);
        } else {
            var formatUrl = url;
        }
        return formatUrl;
    }
};
module.exports = tool;