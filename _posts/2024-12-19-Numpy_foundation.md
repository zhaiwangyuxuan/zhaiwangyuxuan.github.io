---
title: 【AI程设】NumPy 基础
date: 2024-12-19 20:00:00 +0800
categories: [BJTU, NumPy]
tags: [python]     # TAG names should always be lowercase
description: AI程设课上教的 NumPy 基础
---

> 内容来源于 北京交通大学 计算机学院 人工智能专业 大二专业课 人工智能程序设计

> 考试只要会基础就可以

# `NumPy` 基础

- `NumPy` 的核心对象是 `ndarray`

## 数组的构造

- `np.array()`

- `.shape` 属性获取数组形状

```python
a = np.array([1, 2, 3, 4])
b = np.array([[1, 2, 3, 4],
              [5, 6, 7, 8]])

print(a.shape)
# (4,)

print(b.shape)
# (2, 4)
```

- `np.linspace(开头, 结尾, 平均分成几个数)` ，`[start, end]` 闭区间，类型是 `numpy.float64` 

- `np.arange(开头, 结尾, 步长)` ，`[start, end)` 左闭右开区间，步长取值范围是实数。

- 常与 `matplotlib` 联动，用来处理xy轴横纵坐标

```python
a = np.linspace(1, 4, 3)
print(a)
# [1.  2.5 4. ]

b = np.arange(1, 4, 1.5)
print(b)
# [1.  2.5]
```

- `np.eye(x轴, y轴, 偏移值)` **只能**生成二维单位矩阵 

```python
np.eye(3, 4, -1)
# Return a 2-D array with ones on the diagonal and zeros elsewhere.

'''
array([[0., 0., 0., 0.],
       [1., 0., 0., 0.],
       [0., 1., 0., 0.]])
'''
```

- `np.full(形状, 数值)`
- `np.zeros_like(arr)` `np.ones_like(arr)` `np.full_like(arr, 数值)` 模仿`arr`数组的形状
- `np.empty(形状)`

```python
print(np.full((2, 3), 10)) # 创建2*3的矩阵，值为10
# [[10 10 10]
#  [10 10 10]]

np_input=[[1, 2], [3, 4], [5, 6]]
print(np.full((2, 2, 3, 2), np_input)) # 这里最后两维务必要与 np_input.shape 相同

'''
[[[[1 2]
   [3 4]
   [5 6]]

  [[1 2]
   [3 4]
   [5 6]]]


 [[[1 2]
   [3 4]
   [5 6]]

  [[1 2]
   [3 4]
   [5 6]]]]
'''

arr=[[1, 2], [3, 4]]
print(np.zeros_like(arr))
# [[0 0]
#  [0 0]]

print(np.ones_like(arr))
# [[1 1]
#  [1 1]]

print(np.full_like(arr, [100, 500]))
# [[100 500]
#  [100 500]]

print(np.empty((2, 3))) # 创建2*3的空矩阵，占内存

np.empty((4,), np.int32) #创建长度为4的整型数组
```

- `rand()` 服从 `U[0, 1]` 的均匀分布的随机数组
- `randint(a, b, 形状)` 指定 `[a, b)` 内的离散均匀分布数组
- `uniform()` 服从 `U[a, b]` 的均匀分布的随机数组
- `randn()` 服从标准正态 `N[0, 1]` 分布的随机数组
- `normal()` 服从正态分布 `N[μ, σ]` 分布的随机数组
- `poisson()` 服从泊松分布的随机数组
- `choice()` 随机抽取列表
- `shuffle()` 随机打乱顺序
- 形状控制都在后面的参数，前面的参数是数值范围

- 应该不会用

```python
# 导入random模块
from numpy import random as nr
# 显示小数点后两位数
np.set_printoptions(precision=2)
# 均匀分布随机数函数rand、randint、uniform
print(nr.rand(4)) # 一维数组
print(nr.rand(3, 2)) # 二维数组
print(nr.randint(3, 4, (2, 3)))

a, b, size = -1, 2, 3
print(nr.uniform(a, b, size))
print(nr.uniform(a, b, (2, 3)))

print(nr.randn(3, 1, 3))

print(nr.normal(4, 1, (2, 5)))
print(nr.poisson(4, (2, 5)))

# 从数组中随机选择3个元素，指定每个元素的抽取概率
result = nr.choice([1, 2, 3, 4, 5], size=(3, 2), p=[0.1, 0.2, 0.3, 0.2, 0.2])
```

## 数组的变形

- `transpose()` 维度交换办法

- 特殊方法 `.T` ，使维度从正序变为倒序

- `reshape()` 重构数组维度。允许一个维度空缺，可用 -1 表示

```python
carbon = nr.rand(1, 2, 3)
carbon = carbon.transpose(2, 0, 1)
print(carbon.shape)
# (3, 1, 2)

carbon = nr.rand(1, 2, 3, 4)
print(carbon.T.shape)
# (4, 3, 2, 1)

# 实例二
a = np.arange(0, 8, 1).reshape((2, 4), order = 'C')
print(a)
# [[0 1 2 3]
#  [4 5 6 7]]

b = np.arange(0, 8, 1).reshape((2, 4), order='F')
print(b)
# [[0 2 4 6]
#  [1 3 5 7]]

c = np.arange(0, 8, 1).reshape((2, -1), order='C')
print(c)
# [[0 1 2 3]
#  [4 5 6 7]]
```

- `concatenate((a, b), axis = ...)` 同质性(连续性)拼接函数 **基于已有的来拼接**

- `stack((a, b), axis = ...)` 异质性堆叠函数，会堆叠出新的维度，堆叠的维度必须**完全一样**

- `split(ary, indices_or_sections, axis=0)` 分割函数

- `repeat(a, repeats, axis=None)` 重复函数

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 沿新轴（默认轴为0）堆叠数组
result = np.stack((a, b))
print(result)
# 输出：
# [[1 2 3]
#  [4 5 6]]

# 沿轴1堆叠数组
result = np.stack((a, b), axis=1)
print(result)
# 输出：
# [[1 4]
#  [2 5]
#  [3 6]]

# ============================================ #

a = np.array([[1, 2, 3], [4, 5, 6]])
b = np.array([[7, 8, 9], [10, 11, 12]])

# 沿轴0连接数组
result = np.concatenate((a, b), axis=0)
print(result)
# 输出：
# [[ 1  2  3]
#  [ 4  5  6]
#  [ 7  8  9]
#  [10 11 12]]

# 沿轴1连接数组
result = np.concatenate((a, b), axis=1)
print(result)
# 输出：
# [[ 1  2  3  7  8  9]
#  [ 4  5  6 10 11 12]]

# 将数组等分为 2 个子数组
result = np.split(a, 2)
print("\n分割后的数组:")
for arr in result:
    print(arr)

'''
[[0 1 2 3]
 [4 5 6 7]]
[[ 8  9 10 11]
 [12 13 14 15]]
'''

# 在索引 2 和 3 处分割
result = np.split(a, [2, 3])
print("\n分割后的数组:")
for arr in result:
    print(arr)

'''
[[0 1 2 3]
 [4 5 6 7]]
[[ 8  9 10 11]]
[[12 13 14 15]]
'''

a = np.array([1, 2, 3])

# 每个元素重复 2 次
result = np.repeat(a, 2, axis=0)
print("\n重复后的数组:\n", result)

'''
原数组:
 [1 2 3]

重复后的数组:
 [1 1 2 2 3 3]
'''

a = np.array([[1, 2], [3, 4]])

# 沿轴0重复每一行 2 次
result_axis0 = np.repeat(a, 2, axis=0)
print("\n沿轴0重复后的数组:\n", result_axis0)

# 沿轴1重复每一列 3 次
result_axis1 = np.repeat(a, 3, axis=1)
print("\n沿轴1重复后的数组:\n", result_axis1)

'''
原数组:
 [[1 2]
 [3 4]]

沿轴0重复后的数组:
 [[1 2]
 [1 2]
 [3 4]
 [3 4]]

沿轴1重复后的数组:
 [[1 1 1 2 2 2]
 [3 3 3 4 4 4]]
'''
```

- 练习题

    使用repeat()函数构建两个 10×10 的数组，第 1 个数组要求第 i 行的元素值都为i；第2个数组要求第i列的元素值都为i

```python
a = np.arange(1, 11, 1)
a1 = np.repeat(a, 10, axis=0).reshape(10, 10)
a2 = np.repeat(a.reshape(1, 10), 10, axis=0)
```

## 数组的切片 - *重点*

- `array` 数组利用 `[ ]` 符号在相应维度获取子数组

- 通过切片可以对 `ndarray` 中的元素进行更改

- `ndarray` 通过切片产生的新数组与原数组**共享同一数据存储空间**

- 如果想改变这种情况，可以用列表对数组元素切片。即，如果想创立原数组的副本，可以用整数元组，列表，布尔数组进行切片

```python
a = np.arange(10)
print(a)
# [0 1 2 3 4 5 6 7 8 9]

a[2:5] = 100, 101, 102
print(a)
# [  0   1 100 101 102   5   6   7   8   9]

# **共享同一数据存储空间**
b = a[3:7]
b[2] = 999

print(b)
print(a)
# [101 102 999   6]
# [  0   1 100 101 102 999   6   7   8   9]

# 用列表对数组元素切片
c = a[[-1]]
c[0] = 98765

a = np.arange(0, 60, 10).reshape(-1, 1) + np.arange(0, 6)
print(a)
print(a[0, 3:5])
print(a[2::2, ::2])
print(a[(0, 1, 2, 3, 4), (1, 2, 3, 4, 5)])

'''
[[ 0  1  2  3  4  5]
 [10 11 12 13 14 15]
 [20 21 22 23 24 25]
 [30 31 32 33 34 35]
 [40 41 42 43 44 45]
 [50 51 52 53 54 55]]

[3 4]

[[20 22 24]
 [40 42 44]]

[ 1 12 23 34 45]
'''
```

- 练习题

    `arr` 是形状为 `10*5` 的数组, `arr[-2:-10:-3, 1:-1:2]` 的结果？

```python
arr = np.arange(50).reshape(10, 5)
print(arr[-2:-10:-3, 1:-1:2])

'''
array([[41, 43],
       [26, 28],
       [11, 13]])
'''
```

- 练习题

    `arr = np.arange(9).reshape(3, 3)`
    1. 交换 `arr` 的第1列和第3列
    2. 交换 `arr` 的第1行和第2行
    3. 反转 `arr` 的列
    4. 反转 `arr` 的行

```python
arr = np.arange(9).reshape(3, 3)

arr[:, [2, 1, 0]]
arr[[1, 0, 2], :]
arr[:, ::1] = arr[:, ::-1]
arr[::1, :] = arr[::-1, :]
```

## 广播机制

- 将两个数组的 `shape` **靠右对齐**，然后在各个维度上进行兼容性判断：若对应维度上的尺寸完全相同或其中一个维度的尺寸为1，则在该维度上是兼容的。对于不存在的维度，则默认是兼容的

- 当两个不同形状的数组进行运算时，如果形状相互兼容，`NumPy` 会自动触发广播机制, 即转换形状不同的数组，向两个数组每一维度上的最大值靠齐，使它们具有相同的形状再进行运算

1. **维度对齐**：如果两个数组的维度数不同，则小维度数组向左边（外层）补充维数为1的维度

2. **维数比较**：如果两个数组的形状在某一维度上匹配，则维数不变；如果任意一个维度上都不匹配，那么数组的形状会沿着维数为 1 的维度扩展以匹配另外一个数组的形状

3. **抛出异常**：如果两个数组的形状在任意一个维度上都不匹配并且没有任何一个维度等于 1， 则引发异常

- 可以使用 `np.newaxis` 在 `price` 数组中插入新维度

```python
# 维度对齐

a=np.arange(3)+5
# array([5,6,7])
a.shape
# (3,)

a = np.ones((3,3)) + np.arange(3)
# array([[1, 2, 3], [1, 2, 3], [1, 2, 3]])
a.shape
# (3,3)

# 维数比较

np.arange(3).reshape((3,1)) + np.arange(3)
# array([[0, 1, 2], [1, 2, 3], [2, 3, 4]])
a.shape
# (3,3)

np.arange(6).reshape((3,2)) + np.arange(3)
'''
ValueError: operands could not be
broadcast together with shapes (3,2) (3,)
'''

a = np.arange(6)
a[:, np.newaxis].shape
# (6, 1)

a[np.newaxis, :].shape
# (1, 6)
```

- 练习题

    下列的数组维度组合，是否可以广播？如果可以，广播结果的维度是多少？
    - 1 \* 3 \* 5 和 3 \* 1
    - 3 \* 5 \* 3 \* 4 和 1 \* 3 \* 1
    - 3 \* 2 \* 1 \* 5 和 2 \* 5
    - 3 \* 2 \* 5 和 5 \* 2 \* 5

    答案：
    
    - 1 \* 3 \* 5
    - 3 \* 5 \* 3 \* 4
    - 3 \* 2 \* 2 \* 5
    - 不能广播

## 常用函数

- 聚合函数

- `max()` `min()` `mean()` 中位数 `median()` 标准差 `std()` 方差 `var()` 总和 `sum()`

- 分位数 `quantile()` `(数据, 小数)`

- 使用 `np.median()` 和 `np.quantile()` 形式调用

- 注意 `axis = ` 的参数

- 如果数组中聚合的维度有缺失值，则结果中的对应维度**也会被设为缺失值**。如果要忽略缺失值进行计算，使用以 `nan` 开头的聚合函数

```python
my_matrix = np.arange(24).reshape(2, 3, 4)
print(my_matrix)
print(my_matrix.sum(axis = 0))
print(my_matrix.sum(axis = 1))
print(my_matrix.sum(axis = 2))

'''
[[[ 0  1  2  3]
  [ 4  5  6  7]
  [ 8  9 10 11]]

 [[12 13 14 15]
  [16 17 18 19]
  [20 21 22 23]]]

[[12 14 16 18]
 [20 22 24 26]
 [28 30 32 34]]

[[12 15 18 21]
 [48 51 54 57]]

[[ 6 22 38]
 [54 70 86]]
'''

my_matrix[0][0][0] = np.nan
# 设置为缺失值

print(my_matrix.max(axis = (1, 2))) # 考虑缺失值
# [nan 23.]

print(np.nanmax(my_matrix, axis = (1, 2))) # 忽略缺失值
# [11. 23.]
```

- `np.ceil()` 向上取整 `np.floor()` 向下取整

- 算术运算，每一个元素都是对应元素的计算结果

- 关系比较，返回**布尔数组**，每一个元素都是对应元素的比较结果

```python
a = np.array([1, 2, 3]) 
b = np.array([1, 2, 1]) 

a == b # array([True, True, False])
np.isnan(a) # array([False, False, False])
(a >= b).any() # True
(a == b).all() # False
a > b.any() # array([False, True, True])
c = np.arange(1, 10).reshape(3, 3) # array([1, 2, 3], [4, 5, 6], [7, 8, 9])
c1 = ~(c.sum(1) > 10) # array([True, False, False)]
c2 = (c[:, 0] >= 1) & (c[1, :] < 5) # array([True, False, False])
res = c[c1 | c2, :] # array([[1, 2, 3]])
```

- 练习

    给定一个维度为 `m * n`的整数数组，请返回一个元素为 `0` 或 `1` 的同维度数组，当且仅当原数组对应位置上的元素是原数组同行元素中的最大值时，该位置的元素为 `1`

```python
a = np.arange(9).reshape(3, -1)
b = (a == a.max(axis=1).reshape(-1, 1)).astype(int)

'''
[[0 0 1]
 [0 0 1]
 [0 0 1]]
'''
```

- 练习

    利用round()函数将上例中的随机矩阵按第一位小数四舍五入取整，依次筛选出矩阵中满足如下条件的行：
    1. 行元素至多有一个1
    2. 行元素至少有一个0
    3. 行元素既非全0又非全1

```python
arr2 = arr2.round()
res2 = np.sum(arr2 == 1, axis=1) <= 1
res3 = np.sum(arr2 == 0, axis=1) >= 1
res4 = ~(np.sum(arr2 == 0, axis=1) == arr2.shape[1]) & ~(np.sum(arr2 == 1, axis=1) == arr2.shape[1])

'''
[[ 5.  5.  3. 10.  3.  6. 10.  1.  0.]
 [ 4.  7. 10.  2. 11.  7.  8. 11.  5.]
 [ 1.  1.  4.  7.  3.  2.  7.  1.  5.]
 [ 7.  8.  8.  9.  5.  4.  2.  9.  8.]
 [ 4.  1. 10.  4.  6.  5.  0.  2.  6.]
 [ 6.  3.  9.  3.  1.  2.  2.  4.  3.]]

[ True  True False  True  True  True]

[ True False False False  True False]

[ True  True  True  True  True  True]
'''
```

- `np.where()` 函数返回符合条件的元素索引，并可以进一步根据逻辑运算结果填充数组，其格式如下：

```python
a=np.arange(4).reshape(-1,2)
print(a)
# [[0 1]
#  [2 3]]

print(a.sum(0))
# [2 4]

print(a.sum(1))
# [1 5]

# 如果条件为真，选择 sum_axis0 中对应列的值；否则，选择 sum_axis1 中对应行的值
np.where(a > 1, a.sum(0), a.sum(1))
# [[1, 5],
#  [2, 4]]
```

- 索引函数

- `nonzero()` 返回非零数的索引

- `argmax()` 返回最大数的索引

- `argmin()` 返回最小数的索引

```python
a = np.array([0, -5, 0, 1, 3, -1])

np.nonzero(a)
# array([1, 3, 4, 5], dtype=int64)

a.argmax()
# 4

a.argmin()
# 1
```

- 练习

    `np.clip(array, min, max)` 是一种截断函数，对于数组中超过 `max` 的值会被截断为 `max`, 数组中不足 `min` 的值会被截断为 `min`，请用 `np.where()` 实现这个功能