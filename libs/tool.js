/*
 * 工具
 * Author：Rookie
 * creatTs：2017-12-03
 */
const fs = require('fs');

var tool = {
    getFilePath: function (url, method) {
        var prefix = '/api';
        console.log(url);
        var str = url.trim().replace(prefix, "");
        if (str.substr(str.length - 1, 1) == "/") {
            var formatUrl = str.substring(0, str.length - 1);
        } else {
            var formatUrl = str;
        }
        var filePath = "./resource/" + method + formatUrl.replace(/\//g, '.') + ".json";
        return filePath;
    },
    saveName: function (obj) {
        //存储文件名和url到ajaxapilist文件
        var jsonName = './resource/jsonList.json';
        var read = new Promise(function (resolve, reject) {
            resolve(fs.readFileSync(jsonName))
        });

        var _write = new Promise(function (resolve, reject) {
            read.then(function (response) {
                var list = JSON.parse(response).dataList;
                var newDetailList = obj.del ? [] : [{
                    "title": obj.title,
                    "description": obj.description,
                    "path": obj.path,
                    "method": obj.method
                }];
                //如果是删除则不需要这个新的数据
                //合并json
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        //比较path，path不能重复
                        if (obj.path != list[i].path) {
                            newDetailList.push(list[i])
                            continue;
                        }
                    }
                }
                // var jsonString = JSON.stringify(newDetailList, null, 4);
                resolve(fs.writeFileSync(jsonName, JSON.stringify({
                    warn: "存放所有的关系表，建议不要手动修改",
                    dataList: newDetailList
                }, null, 4)))
            }).catch(function (response) {
                console.log('reset')
                resolve(fs.writeFileSync(jsonName, JSON.stringify({
                    "warn": "存放所有的关系表，建议不要手动修改",
                    "dataList": [{
                        "title": obj.title,
                        "description": obj.description,
                        "path": obj.path,
                        "method": obj.method
                    }]
                })))
            })
        })
    },
    updateName: function (obj) {
        //存储文件名和url到ajaxapilist文件
        var jsonName = './resource/jsonList.json';
        var read = new Promise(function (resolve, reject) {
            resolve(fs.readFileSync(jsonName))
        });
        var _write = new Promise(function (resolve, reject) {
            read.then(function (response) {
                var list = JSON.parse(response).dataList;
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        if (obj["orginalPath"] == list[i]["path"]) {
                            list[i]["title"] = obj["title"];
                            list[i]["description"] = obj["description"];
                            list[i]["path"] = obj["path"];
                            list[i]["method"] = obj["method"];
                            continue;
                        }
                    }
                }
                resolve(fs.writeFileSync(jsonName, JSON.stringify({
                    warn: "存放所有的关系表，建议不要手动修改",
                    dataList: list
                }, null, 4)))
            }).catch(function (response) {
                console.log('reset')
                resolve(fs.writeFileSync(jsonName, JSON.stringify({
                    "warn": "存放所有的关系表，建议不要手动修改",
                    "dataList": [{
                        "title": obj.title,
                        "description": obj.description,
                        "path": obj.path,
                        "method": obj.method
                    }]
                })))
            })
        })
    }
};
module.exports = tool;