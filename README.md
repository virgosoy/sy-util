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



## convert.js

类型转换

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