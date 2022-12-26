/**
 * UI工具类，为了统一UI用，此库不允许被本项目其他东西所依赖，仅提供给外部用。
 * 
 * 建议本文件为单独文件，也不依赖本项目的其他文件
 * 
 * @version 0.1.0.210913
 * @changeLog
 *          0.1.0.210913
 * @depentOn
 *          element-plus 1.1.0-beta.9
 */

import { ElMessage, ElMessageBox } from "element-plus";
import { Ref } from "vue";


/**
 * 成功的消息
 * @param message 消息
 */
export function messageOfSuccess(message: string){
    ElMessage.success({message, type: 'success', showClose: true, duration: 3000})
}

/**
 * 失败的消息
 * @param message 消息/消息数组
 */
export function messageOfError(message: Array<string>) : void
export function messageOfError(message: string) : void
export function messageOfError(message: string | Array<string>) : void {
    if(message instanceof Array){
        message.forEach(v => {
            setTimeout(() => _messageOfError(v), 0)
        })
    }else{
        _messageOfError(message)
    }
}

/**
 * 内部调用失败的消息方法
 * @param message 消息
 */
function _messageOfError(message: string){
    ElMessage.error({message, type: 'error', showClose: true, duration: 3000})
}

/**
 * 弹出确认框
 * @param message 消息
 * @returns 
 */
export function confirm(message : string) : Promise<any>{
    return ElMessageBox.confirm(message, {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
    })
}

/**
 * 做一些事情，同时更改传入的状态，UI提示
 * @param {Function} callback 回调函数
 * @param {import('vue').Ref<boolean>} doingRef 进行中的状态ref，可省略。
 * @param {string} successMessage 成功的消息，可选。默认不会提示。
 */
export async function doSomething(callback: () => Promise<any> | void, successMessage ?: string) : Promise<void>
export async function doSomething(callback : () => Promise<any> | void, doingRef ?: Ref<boolean>, successMessage ?: string) : Promise<void>
export async function doSomething(arg1 : () => Promise<any> | void, arg2 ?: Ref<boolean> | string, arg3 ?: string) : Promise<void> {
    let callback = arg1
    let doingRef : Ref<boolean>
    let successMessage : string
    // doingRef参数可省略
    if(typeof(arg2) === 'string'){
        doingRef = undefined
        successMessage = arg2
    }else{
        doingRef = arg2
        successMessage = arg3
    }

    doingRef && (doingRef.value = true)
    try{
        await callback()
        successMessage && UI.messageOfSuccess(successMessage)
    }catch(e){
        UI.messageOfError(e.message)
    }finally{
        doingRef && (doingRef.value = false)
    }
}

const UI = {
    messageOfSuccess,
    messageOfError,
    confirm,
    doSomething,
}

export default UI