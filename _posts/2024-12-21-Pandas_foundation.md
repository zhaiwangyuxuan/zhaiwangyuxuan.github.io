---
title: 【AI程设】Pandas 基础
date: 2024-12-21 10:00:00 +0800
categories: [BJTU, Pandas]
tags: [python]     # TAG names should always be lowercase
description: AI程设课上教的 Pandas 基础
---

> 内容来源于 北京交通大学 计算机学院 人工智能专业 大二专业课 人工智能程序设计

# `Pandas` 基础

## 文件的读取与写入

- `read_table()` 读取 `txt` 文件

- `read_csv()` 读取 `csv` 文件

- `read_excel()` 读取 `xls`、 `xlsx` 文件

- 分隔符：`csv`：`sep = ','` `txt`：`sep = '\t'` `xls/xlsx`：`无该参数`

- `header` 默认将第一行作为列名，输入 `None` 可取消

- `names` 接收 `array` 作为列名

- `index_col` 表示索引列的位置

- `nrows` 表示接收前 `n` 行

- `usecols` 表示读取列的集合，默认读取所有列

- `sheetname` 表示读取的 `excel` 的表格的第几个分表，默认读取第 `0` 个

```python
fp = pd.read_csv("learn_pandas.csv")
```

- `to_csv()` 保存为 `csv` 或 `txt` 文件

- `index` 接收 `boolean`，是否将行名索引写出

- `sep` 表示分隔符，默认为 `,`

- `to_excel()` 保存为 `excel` 文件

- `sheetname = sheet1` 指定存储的表格的名称

```python
fp.to_csv("my_csv.csv", index = False)
fp.to_csv("my_table.txt", sep = '\t', index = False)

fp.to_excel("my_excel.xlsx", index = False)
```

## 基本数据结构

- `Series` 有 `data` `index` `dtype` `name` 四个属性

- 各类可取出的属性：`.values` `.index` `.dtype` `.name` `.shape`

- 直接通过行名检索即可取出对应元素 `s['third']`

- `.value_counts()` 查看元素数量

```python
s=pd.Series(data = [100, 'a', {'dic1':5}], 
            index = pd.Index(['id1', 20, 'third'], name = 'my_index'), 
            dtype = 'object', 
            name = 'my_name')

'''
my_index
id1              100
20                 a
third    {'dic1': 5}
Name: my_name, dtype: object
'''
```

- `DataFrame` 在 `Series` 基础上增加了列索引

- 列索引 `columns`

- 可以通过直接检索列名取出对应的列

- 使用 `to_frame()` 函数可以将序列转换为列数为 `1` 的 `DataFrame`

- `.T` 进行行列转置

- `.set_index()` 将列索引设为行索引

```python
data = [[1, 'a', 1.2], [2, 'b', 2.2], [3, 'c', 3.2]]
df = pd.DataFrame(data = data, 
                  index = ['row_%d' % i for i in range(3)], 
                  columns = ['col_0', 'col_1', 'col_2'])

'''
     col_0  col_1  col_2
row_0	1	  a	   1.2
row_1	2	  b	   2.2
row_2	3	  c	   3.2
'''

df['col_0']
# 形成的是 Series

df[['col_0', 'col_1']]
# 形成的是 DataFrame

df['col_0'].to_frame()
# 将 Series 转化成只有一列的 DataFrame
```

- 可以直接使用 `df[col_name]` 来修改列或新增一列

- 使用 `drop()` 方法删除某一列，`axis = 0` 删除行，`axis = 1` 删除列

- 注意参数可以输入一个列表！！！

- 使用 `rename()` 方法修改列名，用字典

    - 修改列名必须写上 `columns = {'...' : '...'}` 参数

    - 修改行索引则使用 `df.index.rename({'...' : '...'}, inplace = True)`

- 使用 `map(func)` 来合并行索引

```python
df = df.drop(['row_0'], axis = 0)
df = df[df.columns[:-1]] # 消除最后一行

# 修改部分列名
df_renamed = df.rename(columns={'A': 'Alpha', 'B': 'Beta'})

# 直接在原 DataFrame 上修改列名
df.rename(columns={'C': 'Gamma'}, inplace=True)

# 修改行索引
df.index.rename({'gender' : 'Gender'}, inplace=True)

new_index = df_res.index.map(lambda x : (x[0] + '_' + x[1])) 
df_res.index = new_index
# 用下划线合并两层行索引

new2_index = df_res.index.map(lambda x : tuple(x.split('_')))
df_res.index = new2_index
# 把行索引拆分为原状态
```

## 常用基本函数

- `.head()` `.tail()` `.info()` `.describe()`

- `.idxmax()` `.idxmin()` 最大值与最小值出现在哪一行

- 练习

    身体质量指数 `BMI` 的计算方式是体重（单位为 `kg` ）除以身高（单位为 `m` ）的平方。请找出 `BMI` 最高的同学的姓名

```python
df['BMI'] = df['Weight'] / (df['Height'] / 100) ** 2

# 第一种 转换为 DataFrame
df['Name'].to_frame().iloc[df['BMI'].idxmax()]

# 第二种 直接索引 Series
df['Name'][df['BMI'].idxmax()]
```

- `unique()` 去除 `Series` 的重复项

- `nunique()` 返回唯一值的个数

- `value_counts()` 返回唯一值出现的次数

- `drop_duplicates()` 去除 `DataFrame` 的重复行 `subset = []` 决定基于哪一列，`keep = 'last'` 决定保留最后一个重复的数据

- `.replace()` 替换函数

- `.where()` 对条件不成立的行进行替换 `.mask()` 对条件成立的行进行替换

```python
df['Gender'].replace({'Female':0, 'Male':1})
df['Gender'].replace(['Female', 'Male'], [0, 1])

s=pd.Series([-1, 1.2345, 100, -50])
s.where(s < 0)
'''
0    -1.0
1     NaN
2     NaN
3   -50.0
'''
s.where(s < 0, 100)

# ===================== #

s.mask(s < 0)
'''
0         NaN
1      1.2345
2    100.0000
3         NaN
'''
s.mask(s < 0, -50)
```

- `round()` 四舍五入

- `.clip(min, max)` 截断函数

- `sort_values()` **数值排序**函数，默认按照选定的列来升序排序

- `sort_index()` **索引排序**函数

- `.apply(func, axis = 0)` 遍历 `Series` 或 `DataFrame` 并且运行指定的函数

```python
# 将年级和姓名作为索引 set_index()
df_demo = df.set_index(['Grade', 'Name'])

# 对身高进行升序排序
df_demo.sort_values('Height')

# 对身高进行降序排序
df_demo.sort_values('Height', ascending = False)

# 对体重升序排序，当体重相同时对身高按降序排序
df_demo.sort_values(['Weight', 'Height'], ascending = [True, False])

# 行索引排序 年级升序排序，对名字降序排序
df.sort_index(level=['Grade', 'Name'], ascending = [True, False])

# ================================== #

# 自定义函数
def my_mean(x):
    res = x.mean()
    return res
df_demo.apply(my_mean)

# lambda 函数
df_demo.apply(lambda x : x.mean(), axis = 0)
```

