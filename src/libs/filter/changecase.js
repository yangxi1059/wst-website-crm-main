export default  (str, type) => {
    function ToggleCase(str) {
    var itemText = ""
    str.split("").forEach(
    function (item) {
    if (/^([a-z]+)/.test(item)) {
    itemText += item.toUpperCase();
    } else if (/^([A-Z]+)/.test(item)) {
    itemText += item.toLowerCase();
    } else {
    itemText += item;
    }
    });
    return itemText;
    }
    switch (type) {
    case 1:
    return str.replace(/\b\w+\b/g, function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
    });
    case 2:
    return str.replace(/\b\w+\b/g, function (word) {
    return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
    });
    case 3:
    return ToggleCase(str);
    case 4:
    return str.toUpperCase();
    case 5:
    return str.toLowerCase();
    default:
    return str;
    }
   }
/*type
 1:首字母大写
 2：首页母小写
 3：大小写转换
 4：全部大写
 5：全部小写
 * */

  