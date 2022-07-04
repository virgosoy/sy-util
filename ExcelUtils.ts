/**
 *
 * @version 3.0.0.220704 复制修改于 clipboard.js（剪贴板相关工具）v2.1.0.210422，去掉外部依赖，自己实现解析
 * @changeLog 3.0.0.220704 复制修改于 clipboard.js（剪贴板相关工具）v2.1.0.210422，去掉外部依赖，自己实现解析
 */

/**
 * 检查数组是否全部包含指定的数组元素\
 * 从 ObjectUtils v2.0.0.220701 中复制，以让本工具类无外部依赖
 * @param {Array} origin 被查询的数组
 * @param {Array} findArr 查询的数组（含要指定的元素）、
 * @since 3.0.0.220704
 */
const includesAll = (origin: unknown[], findArr: unknown[]) =>
  findArr.every(fv => origin.includes(fv))

/**
 * 根据剪贴板判断是否是excel
 * @param {DataTransfer} cb 剪贴板
 * @returns {Boolean}
 */
export const isExcelInClipboardData = (cb: DataTransfer): boolean =>
  includesAll(cb.types as string[], [
    'text/plain',
    'text/html',
    'text/rtf',
    'Files',
  ])

/**
 * 根据剪贴板获取excel数据，aoa（二维数组）\
 * 以excel显示值为准
 * @param {DataTransfer} html excel 的 html 格式文本
 * @returns 二维数组
 * @since 3.0.0.220704
 */
export function getExcelData(html: string): string[][]
/**
 * 根据剪贴板获取excel数据，aoa（二维数组）\
 * 以excel显示值为准
 * @param {DataTransfer} cb 剪贴板
 * @returns 二维数组
 * @since 3.0.0.220704
 */
export function getExcelData(cb: DataTransfer): string[][]
export function getExcelData(param: string | DataTransfer) {
  // 参数判断
  let html
  if (typeof param === 'string') {
    html = param
  } else {
    html = param.getData('text/html')
  }

  const template = document.createElement('template')
  template.innerHTML = html
  const dom = template.content
  const tableDom = dom.querySelector('table')
  if (!tableDom) {
    return []
  }
  // 二维数组
  const aoa = Array.prototype.slice
    .call(tableDom.querySelectorAll('tr'))
    .map((tr: HTMLTableRowElement) =>
      Array.prototype.slice.call(tr.querySelectorAll('td'))
    )
    .map((tds: HTMLTableCellElement[]) => tds.map(td => td.innerText))
  return aoa
}
