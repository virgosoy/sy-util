/**
 * TS 类型工具类
 * 
 * 所有的函数均不对数据做实际处理，只会处理类型
 * @version 0.5.0.240711 feat(TsTypeUtils): 新增：UnionToTuple - 联合类型转元组类型
 * @changeLog
 *          0.5.0.240711 feat(TsTypeUtils): 新增：UnionToTuple - 联合类型转元组类型
 *          0.4.0.240710 feat(TsTypeUtils): 新增：Prettify - 提高类型的可读性；FieldPartial - 将指定字段设置为可选
 *                       更新：FieldNotNull - 也使用 Prettify，逻辑不变。
 *          0.3.0.230705 feat(TsTypeUtils): DiscriminatedValueType：根据对象的原 key 和 value，获取目标 key 的 value 类型。
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
 * 提高类型的可读性
 * 
 * https://github.com/vuejs/core/commit/4c9bfd2b999ce472f7481aae4f9dc5bb9f76628e#diff-5c7c6077892111616bcd760121ec27f7b4e5e059ef68c9232e24bbc19a5706b9
 * ← 来源：（dx：提高道具显示类型的可读性（4c9bfd2））https://github.com/vuejs/core/blob/main/CHANGELOG.md#330-alpha5-2023-03-26
 * @since 0.4.0.240710
 * @version 0.4.0.240710
 * @example
 * ```ts
 * type A = {a: string} & {b ?: number} 
 * type B = Prettify<A>
 *   // ^? {a: string, b ?: number | undefined}
 * ```
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

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
 * @version 0.4.0.240710
 */
export type FieldNotNull<T, F extends keyof(T)> = Prettify<{
  [P in F] : Exclude<T[P], null>
} & {
  [P in Exclude<keyof T, F>]: T[P]
}>

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
 * 将指定字段设置为可选
 * @since 0.4.0.240710
 * @version 0.4.0.240710
 * @example
 * ```ts
 * type A = {
 *   a: string,
 *   b: number
 * }
 * type B = FieldPartial<A, 'a'>
 *   // ^? 约等于 { a?: string | undefined, b: number}
 * ```
 */
export type FieldPartial<T, F extends keyof(T)> = Prettify<{
  [P in F]?: T[P];
} & {
  [P in Exclude<keyof T, F>]: T[P]
}>

/**
 * 替换对象的 key
 * 
 * 同样支持可辨识类型
 * @example
 * ```ts
 * type A = {t:1,v:3,u:5} | {t:2,v:4,u:6}
 * type B = ReplaceKey<A, 't', 'tt'> // {tt:1,v:3,u:5} | {tt:2,v:4,u:6}
 * ```
 * @since 0.2.0 2023-07-04
 */
export type ReplaceKey<T extends {}, From extends string, To extends string> = 
  {
    [K in keyof T as K extends From ? To : K]: T[K]
  }

/**
 * 根据对象的原 key 和 value，获取目标 key 的 value 类型。
 * 主要用于可辨识类型
 * @template O 对象类型
 * @template SK 原 key
 * @template TK 目标 value 类型对应的 key
 * @template SV 原 key 的 value
 * @example
 * ```ts
 * type A = {t:1,v:3,u:5} | {t:2,v:4,u:6}
 * type B = ValueType<A, 't', 'v', 1> // 3
 * ```
 * @since 0.3.0 2023-07-04
 */
export type DiscriminatedValueType<O extends object, SK extends keyof O, TK extends keyof O, TV extends O[SK], _U extends O = O> =
    _U extends O ? TV extends _U[SK] ? _U[TK] : never : never

// --- 联合类型转元组类型 ---

type UnionToIntersection<U> = 
(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type LastOfUnion<U> = 
UnionToIntersection<U extends any ? (x: U) => 0 : never> extends ((x: infer L) => 0) ? L : never

/**
 * 联合类型转元组类型
 * （如果全是字符串类型，元组的顺序和联合类型的顺序一致，有其他类型的话可能会不一致）
 * @version 0.5.0.240711
 * @since 0.5.0.240711
 * @example
 * ```ts
 * type A = UnionToTuple<'a' | 'b' | 'c'> // ['a', 'b', 'c']
 * ```
 */
export type UnionToTuple<U, T extends any[] = []> = 
[U] extends [never] ? T : UnionToTuple<Exclude<U, LastOfUnion<U>>, [LastOfUnion<U>, ...T]>

// ------