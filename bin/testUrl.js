var filePath = "/Users/lightplan/Coding/mockAdmin/resource/buy/delete.purchaseCarts.:d.json";
var reqPath = "/Users/lightplan/Coding/mockAdmin/resource/ERP/get.rent.erp.commodities.json";
let reqSp = reqPath.split("/").pop();
let fileSp = filePath.split("/").pop();
let dReg = new RegExp(/^[0-9]*[1-9][0-9]*$/);
let finalResult = {
    isNeed: true,
    path: ""
};
if (reqSp == fileSp) {
    console.log("eee");
    finalResult = {
        isNeed: true,
        path: filePath
    }
} else {
    if (fileSp.indexOf(".:d.") > 0 || fileSp.indexOf(".:s.") > 0) {
        let fileSpArray = fileSp.split(".");
        let reqSpArray = reqSp.split(".");

        if (fileSpArray.length == reqSpArray.length) {
            fileSpArray.forEach((item, index, arr) => {
                console.log("23");
                    if (item != reqSpArray[index]) {
                        console.log("24");
                        if (item == ":d") {
                            if (!dReg.test(reqSpArray[index])) {
                                finalResult.isNeed = false;
                            }
                        }else if(item!=":d"&&item!=":s"){
                            finalResult.isNeed = false;
                        }
                    }
                    if(item!=reqSpArray[index]&&item!=":d"&&item!=":s"){
                        console.log("33");
                        finalResult.isNeed = false;
                    }
                    if (index == arr.length - 1) {
                        if (finalResult.isNeed) {
                            finalResult.path = filePath;
                        }
                    }
                }
            )
            ;
        }else{
            console.log("47");
            finalResult.isNeed = false;
        }
    }
    if (finalResult.isNeed) {
        console.log("两个相等");
        console.log(finalResult.path);
    } else {
        console.log("两个不相等");
    }
}
