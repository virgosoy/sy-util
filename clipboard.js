/**
 * 剪贴板相关工具 
 * @version 2.1.0.210422
 */


import { includesAll } from "./basetype"

import * as XLSX from 'xlsx'
// import { compose, split, map, includesAll } from './curry.js'

// /**
//  * 删除数组中最后一个空字符串数据
//  * 会修改原数组
//  * @param {Array} arr
//  * @returns {Array} 返回结果
//  */
// function deleteLastEmptyString (arr) {
//     arr[arr.length - 1] === '' && arr.pop()
//     return arr
// }

// /**
//  * 将dom增加粘贴监听器
//  * @param {HTMLDocument} dom Dom对象
//  * @param {Function} callback 回调函数，参数：{@link pasteHandler}
//  */
// export function addPasteListener (dom, callback) {
//     dom.addEventListener('paste', function (ev) {
//         pasteHandler(ev, callback)
//     })
// }

// /**
//  * 将excel转二维数组数据\
//  * 根据 \t 分列，\r\n 分行\
//  * String -> Array
//  */
// const _convertTo2DArr = compose(map(split('\t')), deleteLastEmptyString, split('\r\n'))
// // deleteLastEmptyString(text.split('\r\n')).map((row) => row.split('\t'))

// /**
//  * 解析事件对象并进行处理\
//  * 从excel复制到的text数据最后带有/r/n
//  * @param {ClipboardEvent} ev 剪贴板事件对象
//  * @param {Function} callback 回调函数，参数：{event事件对象,text文本数据,data解析后的二维数组数据,clipboardData剪贴板数据}
//  */
// export function pasteHandler (ev, callback) {
//     // 兼容性： IE || Chrome
//     var clipboardData = window.clipboardData || ev.clipboardData
//     var text = clipboardData.getData('text')
//     if (text && text !== '') {
//         var data = _convertTo2DArr(text) 
//     }
//     callback.call(this, { event: ev, text, data, clipboardData })
// }

/**
 * 根据剪贴板判断是否是excel
 * @param {DataTransfer} cb 剪贴板
 * @returns {Boolean} 
 */
export const isExcel = (cb) => includesAll(cb.types, ['text/plain', 'text/html', 'text/rtf', 'Files'])

/**
 * 根据剪贴板获取excel数据，aoa（二维数组）\
 * 以excel显示值为准
 * @param {DataTransfer} cb 剪贴板
 * @version 2.1.0.210422
 */
export function getExcelData(cb){
    let html = cb.getData('text/html')
    let wb = XLSX.read(html,{type:'string', raw: true})
    let worksheet = wb.Sheets[wb.SheetNames[0]]
    return sheetToAoa(worksheet)
}

/**
 * sheet转二维数组（Array of Arrays）
 * @param {import('xlsx').WorkSheet} worksheet 
 * @returns {Array<Array<String>>} 二维数组，第一维是行
 */
function sheetToAoa(worksheet){
    let range = XLSX.utils.decode_range(worksheet['!ref'])
    let result = []
    let row;
    for(let R = range.s.r; R <= range.e.r; ++R) {
        row = []
        for(let C = range.s.c; C <= range.e.c; ++C) {
            let cellAddress = {c:C, r:R};
            let cellRef = XLSX.utils.encode_cell(cellAddress);
            row.push(worksheet[cellRef]?.v ?? '')
        }
        result.push(row)
    }
    return result;
}