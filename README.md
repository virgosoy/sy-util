# sy-util
javascript utils



## validate.js

input 字符串校验类

esmodule类型，使用原生js

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

字符串工具类

### 2.0.0.220610

复制自 validate.js v1.3.0.200911

#### Added

hasLength、hasText 方法

#### Deprecated

isEmpty、isEmptyTrim 方法

## convert.ts

类型转换 v2 版本，使用 ts

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

## ObjectUtils

[]、{}、any 类型 工具类

### 2.2.0.221228

将 soy-functional.js 所有方法复制修改到此处。

即新增了方法：groupBy、distinct、comparator

### 2.1.0.221115

feat: 增加方法 cartesianProductRecordArray（Record数组的笛卡尔积）

### 2.0.0.220701

从 basetype.js（基础数据类型工具类）修改，改为 ts