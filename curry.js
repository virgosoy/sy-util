
/* 柯里化的函数 
    依赖 lodash-es/curry
    @version 1.1.0.200517
*/
import curry from 'https://unpkg.com/lodash-es@4.17.15/curry.js'

/**
 * 函数式编程的组合函数\
 * 从右往左运行
 * @param {Function} f 
 * @param {Function} g 
 */
const _compose = function (f, g) {
    return function (x) {
        return f(g(x))
    }
}
/**
 * 函数式编程的组合函数\
 * 从右往左运行
 * @param  {...any} fs 
 */
export const compose = (...fs) => fs.reduce((x, y) => _compose(x, y))

/**
 * 柯里化String#split\
 * split :: string -> string -> Array\
 * arr = split(s)(str)
 */
export const split = curry( (s, str) => str.split(s) )


/**
 * 柯里化Array#map\
 * map :: Function -> Array -> Array\
 * arr = map(f)(arr)
 */
export const map = curry( (f, arr) => arr.map(f) )


/**
 * 柯里化Array#includes\
 * includes :: obj -> Array -> boolean\
 * bool = includes(item)(arr)\
 * ie 不支持、Edge 14、Firefox 43、Chrome 47、Safari 9
 */
export const includes = curry( (item, arr) => arr.includes(item) )

/**
 * 检查数组是否全部包含指定的数组元素\
 * includesAll :: Array -> Array -> Boolean
 * @param {Array} findArr 查询的数组
 * @param {Array} arr 被查询的数组
 * @returns {Boolean} 如果包含全部，返回true，否则返回false
 */
export const includesAll = curry((findArr,arr) => findArr.every(fv => arr.includes(fv)))

// /**
//  *  模拟switch case
//  * @param {Object} switchConfig ={case:{String:String},default:String}
//  * @param {String} caseData 要进行case的数据
//  * @returns {String} 返回结果
//  */
// var _switch = function(switchConfig,caseData){
//     // 如果 caseData 等于 switchConfig.case 的某个key，则取其值，否则取 switchConfig.default
//     return (switchConfig.case || {})[caseData] || switchConfig.default
// }

// /**
//  * 
//  * choose :: Object -> string -> string
//  * result = choose(switchConfig)(caseData)
//  */
// export const choose = curry(_switch)

// /**
//  * 
//  * choose :: Object -> Object -> Object -> Object
//  * choose(defaultValue)(case)(check)
//  */
// export const choose = curry( (defaultValue, caseCondition, check) => 
//     ( includes(check)(Object.keys(caseCondition)) ? caseCondition[check] : defaultValue) )