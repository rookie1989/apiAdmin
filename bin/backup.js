const fs = require('fs');
const co = require('co');
const path = require('path');
const oss = require('ali-oss');
let moment = require('moment');

//构建oss对象
const store = oss({
    accessKeyId: 'YOUR accessKeyId',
    accessKeySecret: 'YOUR accessKeySecret',
    bucket: 'bucket',
    region: 'oss-cn-shanghai',
});

(() => {
    const root = path.resolve(__dirname, '../resource');
    const files = [];
    const notUpload = [".DS_Store", "jsonList.json"];

    //递归取出所有文件夹下所有文件的路径
    function readDirSync(path) {
        const pa = fs.readdirSync(path);
        pa.forEach((name) => {
            const cur_path = `${path}/${name}`;
            const info = fs.statSync(cur_path);
            if (info.isDirectory()) {
                readDirSync(cur_path);
            }else{
                if (notUpload.indexOf(name) < 0) {
                    // 排除文件夹
                    files.push(cur_path);
                }
            }
        });
    }

    readDirSync(root);
    co(function* () {
        //遍历文件
        for (let index = 0; index < files.length; index += 1) {
            const e = files[index];
            const folder="mock/"+moment(new Date()).format("YYYY-MM-DD_HH:mm:ss");
            // 设置上传到bucket的文件夹，如果是/resource/ERP文件夹下的文件自动放到/mock/ERP目录
            const result = yield store.put(e.replace(root, folder), e);
            if(result.res.status==200){
                console.log(e + "==============> Done");
                if(index==files.length-1){
                    console.log("All file has be upload");
                }
            }
        }
    }).catch(function (err) {
        console.log(err);
    });
})();
