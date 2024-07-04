# sy-util
javascript utils



## validate.js

@Deprecated 2023-06-27 使用 StringUtils.ts v2.0.0.220610 代替

input 字符串校验类

v1 为 esmodule类型，使用原生js，名称为 validate.js

v2 为 ts 且重命名为 ValidateUtils.ts

### 所有方法

isEmail - 邮箱

isEmpty - 是否为空

isDate - 是否为日期

isDateTime - 是否为日期时间

isMobile - 手机号码

isPhone - 电话号码

isURL - URL地址

isNumber - 数字

isEmptyTrim - 为空（去除空格后校验）

isInteger - 整数(带负号也可)

### 2.0.0.230420

从 validate.js 1.3.0.200911 版本改为 ts

### 1.3.0.200911

feat: 增加 isInteger

### 1.2.0.200614

feat: 增加 isEmptyTrim

### 1.1.0.200517

A：isDate - 是否为日期

### 1.0.0.200516

方法：

isEmail - 邮箱

isEmpty - 是否为空

isDateTime - 是否为日期时间

isMobile - 手机号码

isPhone - 电话号码

isURL - URL地址

isNumber - 数字

## StringUtils.ts

字符串工具类，包含了 validate.js v1 所有方法

### 2.3.0.230907

 feat:

- wrapIfNotZero 如果数字不为0，那么将其包裹在指定前后缀中，否则返回固定文本。

- joinIfHasLength 给定字符串数组，如果元素有长度，则参与合并。

### 2.2.0.230907

feat: wrapIfHasLength 将字符串包裹在指定前后缀中，如果为空字符串则不操作

### 2.1.0.230627

feat: formatNumber 格式化数字为千分位

### 2.0.0.220610

复制自 validate.js v1.3.0.200911

#### Added

hasLength、hasText 方法

#### Deprecated

isEmpty、isEmptyTrim 方法

## convert.ts

类型转换 v2 版本，使用 ts

### 2.2.0.230906

#### Added

- feat: findParents 查找当前对象与其所有父节点

### 2.1.1.230825 

#### Fixed

- fix: 无法识别 NaN

### 2.1.0.220630

#### Added

- numberToABC - 数字转 ABC，类似 excel 的列头，A=1
- numberFromABC - ABC 转数字，ABC 类似 excel 的列头，A=1

### 2.0.0.220428

toTree - 列表转树形结构

toTreeKeepItem - 列表转树形结构

## convert.js

类型转换 v1

esmodule类型，使用原生js，需ES2017及以上

### 所有方法

arrToObj - 数组转对象

objToArr - 对象转数组

flatObj - 将嵌套对象平铺，用"."隔开

### 1.1.2.210105

修正bug：objToArr异常
### 1.1.1.210105

修正bug：flatObj不支持null、objToArr异常

### 1.1.0.210105

新增方法：

flatObj - 将嵌套对象平铺，用"."隔开

### 1.0.1.200516

U：修改一下注释

### 1.0.0.200516

新增方法：

arrToObj - 数组转对象

objToArr - 对象转数组



## curry.js

柯里化的函数 
依赖 lodash-es/curry

### 所有方法

compose - 组合函数

split - 柯里化String#split

map - 柯里化Array#map

includes - 柯里化Array#includes

includesAll - 检查数组是否全部包含指定的数组元素

### 1.1.0.200517

A：includesAll - 检查数组是否全部包含指定的数组元素

### 1.0.0.200517

新增方法：

compose - 组合函数

split - 柯里化String#split

map - 柯里化Array#map

includes - 柯里化Array#includes

## ExcelUtils.ts

### 3.0.0.220704

复制修改于 clipboard.js v2.1.0.210422（剪贴板相关工具），去掉外部依赖，自己实现解析

## PromiseUtils.ts

Promise 工具类

### 当前版本：0.3.0.240226

### 所有方法

主要是处理多个 Promise 的组合调用

* queue - 队列，按顺序执行 promise
* 异步 map 系列方法：asyncMap、asyncSequentialMap、asyncParallelMap - 对数组执行异步的 map，其中 asyncMap 加参数是 asyncSequentialMap、asyncParallelMap 的别名。asyncSequentialMap 功能等同于 queue，只是后者回调函数的参数少。

一些工具方法：

- sleep - 一段时间后返回 resolve



## clipboard.js 2

依赖xlsx、./basetype.js

###### 2.1.0.210422

fix: 获取日期格式有误，修改为以excel显示值为准



## clipboard.js

剪贴板+excel，esmodule

依赖xlsx

### 所有方法

addPasteListener - 将dom增加粘贴监听器

pasteHandler - 解析事件对象并进行处理

isExcel - 根据剪贴板判断是否是excel

getExcelData - 根据剪贴板获取excel数据（二维数组）

### 1.0.0.200517

A：方法：

addPasteListener - 将dom增加粘贴监听器

pasteHandler - 解析事件对象并进行处理

isExcel - 根据剪贴板判断是否是excel

getExcelData - 根据剪贴板获取excel数据（二维数组）

## ui.ts quasar

UI 工具类，封装一些常用的 UI

一般是贴合实际项目的，可能并不通用

例子：

```js
await UI.doSomething(async () => await apiInvoke(param1, param2), '成功信息')
await UI.doSomething(apiInvoke, [param1, param2], '成功信息')

await UI.tryDo('成功信息', async () => await apiInvoke(param1, param2))
await UI.tryDo('成功信息', apiInvoke, param1, param2)
// 以下仅 quasar ui
await UI.tryCall('成功信息', async () => await asyncInvoke(param1, param2))()
await UI.tryCall('成功信息', asyncInvoke)(param1, param2)
UI.tryCall('成功信息', syncInvoke)(param1, param2)
```





## ObjectUtils

[]、{}、any 类型 工具类

### 2.16.0.240627

feat(ObjectUtils): 2.16.0.240627 comparatorOfEnum：比较器，按指定的枚举顺序排序

### 2.15.0.240219

feat(ObjectUtils): 2.15.0.240219 deleteUndefinedValue：删除对象中值为 undefined 的字段

### 2.14.0.230906

feat(ObjectUtils): 2.14.0.230906 feat: omit: 忽略对象指定 keys，返回一个新对象；并修正一些ts检查

### 2.13.0.230710

feat(ObjectUtils): 2.13.0.230710 pick: 过滤对象指定 keys，返回一个新对象

### 2.12.0.230706

feat(ObjectUtils): 2.12.0.230706 新增 WeakMap 的 5 个工具方法 mapGetOrSetIfAbsent、mapCompute、mapComputeIfAbsent、mapComputeIfPresent、mapMerge

### 2.11.0.230705 

feat(ObjectUtils): 2.11.0.230705 mapValues：将对象的值进行映射，返回一个新对象；setItems：给原数组元素一一赋值；moveArrayItemOrderNumberById：移动数组元素，通过排序号确定顺序

### 2.10.0.230628

feat(ObjectUtils): mapdistinct：使用 map 结构进行 distinct；required：如果值存在则返回该值，否则抛出错误

### 2.9.0.230508

feat: give 支持多参数

### 2.8.0.230508

feat: 新增 give 方法，cartesianProductRecordArray 支持不定长参数中传入 undefined

### 2.7.0.230507

feat: throwError

#### 2.6.1.230506

fix: 修改一些语法/类型问题

### 2.6.0.230505

feat: moveArrayByIndex 移动数组元素，会修改原数组，moveArrayById 根据id移动数组元素，会修改原数组

### 2.5.0.230223

feat: comparatorAll 对多个字段生成比较器、comparator 中的类型细化

#### 2.4.1.230216

fix: moveArrayItemOrderNumber 返回时缺少元素

### 2.4.0.230215

feat: moveArrayItemOrderNumber 移动数组元素，通过排序号确定顺序

#### 2.3.1.221228

fix: distinct 返回类型不对

### 2.3.0.221228

增加方法 diffAdd 比较获取目标数组比原数组多的元素

### 2.2.0.221228

将 soy-functional.js 所有方法复制修改到此处。

即新增了方法：groupBy、distinct、comparator

### 2.1.0.221115

feat: 增加方法 cartesianProductRecordArray（Record数组的笛卡尔积）

### 2.0.0.220701

从 basetype.js（基础数据类型工具类）修改，改为 ts



## TsTypeUtils

TS 类型工具类

所有的函数均不对数据做实际处理，只会处理类型

### 0.3.0.230705

feat(TsTypeUtils): DiscriminatedValueType：根据对象的原 key 和 value，获取目标 key 的 value 类型。

### 0.2.0.230704

feat(TsTypeUtils): 0.2.0.230704 ReplaceKey：替换对象的 key

### 0.1.0.230424

ShrinkFieldType / StringFieldEnum - 缩小字段类型

MaybeFieldType - 可能字段类型，用于 IDE 提示输入，不对类型做额外控制

FieldNotNull - 将指定字段设置为非空



## vue 系列

### createSharedComposable.ts

创建可共享的可组合项



## Nuxt 系列

### useSseServer.ts / useSseClient.ts

方便客户端和服务端使用 Server-Send Events（SSE）

useSseServer.ts @version 2024-07-03

useSssClient.ts @version 2024-07-04



## VSCode 系列

是一些相关的配置，而非代码

代码片段：

* nuxt.code-snippets
* vue.code-snippets







