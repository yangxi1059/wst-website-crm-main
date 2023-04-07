/*
 * @Author: 杨曦
 * @Date: 2020-09-04 11:36:12
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-08-16 10:40:55
 * @Version: 
 * @Description: 
 */
//JavaScript根据文件名判断文件类型

export const typeMatch = (fileName) => {
    var docExt = new Array(".xls",".xlsx",".pdf",".ppt",".pptx",'.doc','.docx');//word文件的后缀名
    fileName = fileName.toLowerCase();
    let i = fileName.lastIndexOf(".");
    if(i > -1){
        var ext = fileName.substring(i);
    }
    console.log(ext)
    for(var j=0; j<docExt.length; j++){
        if(docExt[j] === ext){
            return true;
        }
    }
}
export const typeMatchAudio = (fileName) => {
    var docExt = new Array(".mp3",".m4a");//word文件的后缀名
    fileName = fileName.toLowerCase();
    let i = fileName.lastIndexOf(".");
    if(i > -1){
        var ext = fileName.substring(i);
    }
    console.log(ext)
    for(var j=0; j<docExt.length; j++){
        if(docExt[j] === ext){
            return true;
        }
    }
}
export const typeMatchBook = (fileName) => {
    var docExt = new Array(".xls",".xlsx",".pdf",".ppt",".pptx",'.doc','.docx','.avi','.m4v','.mp3','.mp4','.mov','.wmv','.mkv','.flv','.f4v','.rmvb','.webm','.mpeg');//word文件的后缀名
    fileName = fileName.toLowerCase();
    let i = fileName.lastIndexOf(".");
    if(i > -1){
        var ext = fileName.substring(i);
    }
    console.log(ext)
    for(var j=0; j<docExt.length; j++){
        if(docExt[j] === ext){
            return true;
        }
    }
}
export const typeString = (fileName) => {
    fileName = fileName.toLowerCase();
    let i = fileName.lastIndexOf(".");
    if(i > -1){
        var ext = fileName.substring(i);
    }
    return(ext)
}
export const typeString2 = (fileName) => {
    fileName = fileName.toLowerCase();
    let i = fileName.lastIndexOf(".");
    if(i > -1){
        var ext = fileName.substring(i+1);
    }
    return(ext)
}