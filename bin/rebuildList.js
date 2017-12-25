#!/usr/bin/env node

/**
 * rebuild jsonList nav.
 */

const fs = require('fs');
const path = require('path');
let tool = require("../libs/tool");

(() => {
    const root = path.resolve(__dirname, '../resource');
    const files = [];
    let listData = new Object();
    listData["warn"] = "存放所有的关系表，建议不要手动修改";
    listData["dataList"] = [];
    var notAddToArray = [".DS_Store", "jsonList.json"];

    //递归取出所有文件夹下所有文件的路径
    function readDirSync(findDir) {
        // const pa = fs.readdirSync(path);
        // pa.forEach((name) => {
        //     const cur_path = `${path}/${name}`;
        //     const info = fs.statSync(cur_path);
        //     if (name != "jsonList.json" && name != ".DS_Store") {
        //         files.push(cur_path);
        //     }
        // });
        const pa = fs.readdirSync(findDir);
        pa.forEach((name) => {
            const cur_path = `${findDir}/${name}`;
            const info = fs.statSync(cur_path);
            if (info.isDirectory()) {
                readDirSync(cur_path);
            }else{
                // console.log(name);
                // 判断此文件是否是不需要的
                if (notAddToArray.indexOf(name) < 0) {
                    // 排除文件夹
                    files.push(cur_path);
                }
            }
        });
    }

    function writeFile(data) {
        let jsonName = "./resource/jsonList.json";
        var jsonString = JSON.stringify(data, null, 4);
        var read = new Promise(function (resolve, reject) {
            resolve(fs.writeFileSync(jsonName, jsonString))
        });
        fs.unlinkSync(jsonName);
        fs.writeFileSync(jsonName, jsonString);
        fs.closeSync = function (fd) {
            return binding.close(fd);
        };
        console.log("Rebuild Json list has done")
    };

    function getItem(fileName, index, arr) {
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (!err) {
                var data = JSON.parse(data);
                let item = {
                    title: data.title,
                    project: data.project,
                    url: data.url,
                    method: data.method
                };
                listData["dataList"].push(item);
                if (index == arr.length - 1) {
                    console.log(index + "======================");
                    console.log(listData);
                    writeFile(listData);
                }
            } else {
                console.error(err);
            }
        });
    };
    readDirSync(root);
    console.log(files);
    files.map((file, index, arr) => {
        getItem(file, index, arr);
        if(index==arr.length-1){
            return {
                "results":"success"
            }
        }
    });
})();
