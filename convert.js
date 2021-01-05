
/* 类型转换 
    @version 1.1.1.210105
*/

/**
 * 数组转对象
 * 浅克隆
 * var arr = [{key:'name',label:'姓名'},{key:'age',label:'年龄'}]
 * arrToObj(arr,'key') // {name:{key:'name',label:'姓名'},age:{key:'age',label:'年龄'}}
 * @param {Array} arr 要转换的数组
 * @param {String} key 指定数组元素中的什么key的值作为转换后对象的key
 * @returns {Object}
 */
export function arrToObj(arr,key){
    let result = {}
    arr.forEach(item => {
        result[item[key]] = item
    })
    return result
}

/**
 * 对象转数组
 * var obj = {name:{label:'姓名'},age:{label:'年龄'}}
 * objToArr(obj,'key') // [{key:'name',label:'姓名'},{key:'age',label:'年龄'}]
 * @param {Object} obj 要转换的对象
 * @param {String} key 指定对象的key转为数组元素的key的什么名称
 * @returns {Array}
 * @version 1.1.1.210105
 */
export function objToArr(obj,key){
    return Object.entitys(obj).map(([k,v])=>({[key]:k,...v}))
}

/**
 * 判断是否有子元素并处理
 * @param {*} obj 
 * @param {*} result 
 * @param {string} fatherKey 
 * @version 1.1.1.210105
 */
function _hasChildren(obj,result,fatherKey = undefined){
    if(typeof obj === "object" && obj !== null){
        var keys = Object.keys(obj)
        keys.forEach(key=>{
            _hasChildren(obj[key],result,fatherKey ? fatherKey+"."+key : key)
        })
    }else {
        result[fatherKey] = obj
    }
}

/**
 * 将嵌套对象平铺，用"."隔开
 * @param {Object} obj
 * @version 1.1.1.210105
 */
export const flatObj = function (obj) {
    var result = {}
    _hasChildren(obj,result)
    return result;
}