/**
 * TS 类型工具类
 * 
 * 所有的函数均不对数据做实际处理，只会处理类型
 * @version 0.2.0.230704 ReplaceKey：替换对象的 key
 * @changeLog
 *          0.2.0.230704 ReplaceKey：替换对象的 key
 *          0.1.0.230424
 */

/**
 * 缩小字段类型
 * @example
 * type A = {
 *   a: string
 *   b: string
 * }
 * type B = ShrinkFieldType<A, 'a', '1' | '2'>
 * const b : B = {
 *   a: '1', // 只能输入'1'、'2'，其他会报错
 *   b: '3'
 * }
 * @since 0.1.0.230424
 */
export type ShrinkFieldType<T, F extends keyof(T), E extends T[F]> = T & {
  [k in F]: E
}

/**
 * 字符串字段枚举
 * 
 * ShrinkFieldType 的别名
 * @since 0.1.0.230424
 */
export type StringFieldEnum<T, F extends keyof(T), E extends T[F]> = ShrinkFieldType<T, F, E>

/**
 * 收缩表格字段类型（柯里化函数），不对数据处理
 * @example
 * shrinkTableFieldTypeCurry(myTable)<'field', 'value1' | 'value2'>()
 * @param table 
 * @returns 
 * @since 0.1.0.230424
 */
export function shrinkTableFieldTypeCurry<T = unknown>(table: T[]) {
  return function<F extends keyof(T) = keyof(T), E extends T[F] = T[F]>() {
    return table as ShrinkFieldType<T, F, E>[]
  }
}

/*
type A = {
  a: string
  b: string
} | {
  a: '1' | '2'
}

type B = {
  a: string
  b: string
}

type BB = ShrinkFieldType<B, 'a', '1' | '2'>

const a : A = {
  a: '4',
  b: '3'
}

const b : BB ={
  a: '3',
  b: '3'
}
*/


/**
 * 可能字段类型，用于 IDE 提示输入，不对类型做额外控制
 * @example
 * type A = {
 *   a: string
 *   b: string
 * }
 * type B = MaybeFieldType<A, 'a', '1' | '2'>
 * const b : B = {
 *   a: '1', // IDE 会提示输入'1'、'2'，但输入其他也不会错
 *   b: '3'
 * }
 * @since 0.1.0.230424
 */
type MaybeFieldType<T, F extends keyof(T), E extends T[F]> = T | {
  [k in F]: E
}

/**
 * 将指定字段设置为非空
 * @example
 * type A = {
 *   a: string | null
 *   b: string | null
 * }
 * type B = FieldNotNull<A, 'a'>
 *   // ^? 等同于 {a: string; b: string | null;}
 * const b : B = {
 *   a: '1', // 不允许为 null 了
 *   b: null
 * }
 * @since 0.1.0.230424
 */
export type FieldNotNull<T, F extends keyof(T)> = {
  [P in F] : Exclude<T[P], null>
} & {
  [P in Exclude<keyof T, F>]: T[P]
}

/**
 * 将表格中指定字段设置为非空（柯里化函数），不对数据处理
 * @param table 
 * @returns 
 * @since 0.1.0.230424
 */
export function tableFieldNotNullCurry<T>(table: T[]){
  return function<F extends keyof(T)>(){
    return table as FieldNotNull<T, F>[]
  }
}

/**
 * 替换对象的 key
 * 
 * 同样支持可辨识类型
 * @example
 * type A = {t:1,v:3,u:5} | {t:2,v:4,u:6}
 * type B = ReplaceKey<A, 't', 'tt'> // {tt:1,v:3,u:5} | {tt:2,v:4,u:6}
 * @since 0.2.0 2023-07-04
 */
export type ReplaceKey<T extends {}, From extends string, To extends string> = 
  {
    [K in keyof T as K extends From ? To : K]: T[K]
  }
