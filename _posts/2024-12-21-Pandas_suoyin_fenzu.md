---
title: 【AI程设】Pandas 索引与分组
date: 2024-12-21 10:00:00 +0800
categories: [BJTU, Pandas]
tags: [python]     # TAG names should always be lowercase
description: AI程设课上教的 Pandas 索引与分组
---

> 内容来源于 北京交通大学 计算机学院 人工智能专业 大二专业课 人工智能程序设计

# `Pandas` 索引

## `Series` 单级索引

- 以字符串为索引，则为**闭区间**！！！

- 以整数为索引，返回对应索引位置的值，**左闭右开**！！！

- 有重复索引，需要先排序再切片

```python
s = pd.Series(data = [1, 2, 3, 4, 5, 6], 
              index = ['a', 'b', 'a', 'a', 'a', 'c'])

s['c':'b':-2]
'''
c    6
a    4
b    2
'''

s.['c':'a':-2]
# Cannot get left slice bound for non-unique label: 'a'

s.sort_index()['c':'a':-2]
'''
c    6
a    5
a    3
'''
```

## `DataFrame` 索引

- `loc` 基于**元素**索引

- `iloc` 基于**位置**索引

-  `loc` 和 `iloc` 都是行索引办法

- `isin([一个列表])` 筛选出在符合列表条件的元素

```python
df_demo.loc[['Gaojuan You', 'Gaoqiang Qian'], ['School', 'Gender']]
# 选出这两个人的学校和性别

df_demo.loc[df_demo['Weight'] > 70]
# 选出体重 > 70kg 的学生

l = ['Freshman', 'Senior']
df_demo.loc[df_demo['Grade'].isin(l)]

# 选出A大学体重超过70kg的大四学生, 或者B大学体重超过80kg的非大四学生
cond_1 = df_demo.School == 'A'
cond_2 = df_demo.Grade == 'Senior'
cond_3 = df_demo.Weight > 70
cond_4 = df_demo.School == 'B'
cond_5 = df_demo.Grade != 'Senior'
cond_6 = df_demo.Weight > 80
con_A = cond_1 & cond_2 & cond_3
con_B = cond_4 & cond_5 & cond_6
df_demo.loc[con_A | con_B]
```

```python
df_demo.iloc[1, 1]  # Freshman 
df_demo.iloc[[0, 1], [0, 1]]  # 前两行两列 
df_demo.iloc[1:4, 2:4] # 整数切片不包含结束值
df_demo.iloc[np.isin(np.arange(df_demo.shape[0]), [1,2,3])]
df_demo.iloc[(df_demo.Weight > 80).values]
# 使用布尔列表索引不能传入Series而必须传入序列的values，否则会报错。
# 因此使用布尔索引时应优先考虑使用loc方法
```

- `query()` 函数 可以传入字符串形式的查询表达式

- 其中，变量要用 `" "` 括起来

```python
df.query('School=="A" & Weight > 70 & Grade == "Senior" | School == "B" & Weight > 80 & Grade != "Senior"')

# 筛选出男生中不是大二、大三的学生
df.query('Grade not in ["Junior", "Sophomore"] & Gender == "Male"')

# 筛选出全部大三、大四的学生
df.query('Grade in ["Junior", "Senior"]') 

# 或者引用外部变量：
# 引用外部变量，在变量名前加 @
query_list = ['Junior', 'Senior'] 
df.query('Grade == @query_list')
```

# `Pandas` 分组

## `groupby()` 分组函数

- `df.groupby(分组依据)[数据来源].操作`

```python
# 按学校和性别分组统计身高均值

df.groupby(['School', 'Gender'])
# <pandas.core.groupby.generic.DataFrameGroupBy object at 0x...>

df.groupby(['School', 'Gender'])['Height']
# <pandas.core.groupby.generic.SeriesGroupBy object at 0x...>

df.groupby(['School', 'Gender'])['Height'].mean()
'''
School  Gender
A       Female    159.122500
        Male      176.760000
B       Female    158.666667
        Male      172.030000
C       Female    158.776923
        Male      174.212500
D       Female    159.753333
        Male      171.638889
Name: Height, dtype: float64
'''

# 根据学生体重是否超过均值分组统计身高均值
cond = df.Weight > df.Weight.mean()
df.groupby(cond)['Height'].mean()
```

- 练习

    请根据 0.25 分位数和 0.75 分位数将体重分为 high, normal, low 三组统计身高均值

```python
q25 = df['Weight'].quantile(0.25)
q75 = df['Weight'].quantile(0.75)

def categorize_weight(weight):
    if weight < q25:
        return 'low'
    elif weight > q75:
        return 'high'
    else:
        return 'normal'

df['Weight_Category'] = df['Weight'].apply(categorize_weight)

mean_height = df.groupby('Weight_Category')['Height'].mean()
```

- `groupby()` 创建了 `groupby` 对象，有以下属性和方法

- 返回有几组：`.ngroups`

- 返回每组的 `Key` 和 `value`：`.groups`

- 简单看一下形状：`.size()`

- 获取特定组的数据：`.get_group(('a', 'b'))`

- 内置大量聚合函数，需要注意 `idxmin()` `idxmax()`，其它常见的也都有，这些聚合函数直接挂在变量后面即可

- `agg()` 聚合函数

```python
gb = df.groupby(['School', 'Grade']).agg(['sum', 'idxmax'])

gb = df.groupby(['School', 'Grade']).agg({'School' : 'sum', 
                                          'Grade' : 'idxmax'})

'''
DataFrame.groupby('列名').agg({
    '列1': '聚合函数1',
    '列2': ['聚合函数2', '聚合函数3'],
    ...
})
'''
```

- 变换函数

- 累计函数 `cumsum()`, `cumprod()`, `cummax()`, `cummin()`, `cumcount()`

```python
df['Cumulative_Sum'] = df['Value'].cumsum()
print("\n添加 'Cumulative_Sum' 列后的 DataFrame:\n", df)
# 输出：
# 添加 'Cumulative_Sum' 列后的 DataFrame:
#   Category  Value  Cumulative_Sum
# 0        A     10              10
# 1        A     20              30
# 2        B     30              60
# 3        B     40             100
# 4        C     50             150
# 5        C     60             210

# 累计计数：cumcount()
# 这里，cumcount() 用于计算每个组内的累计计数
grouped = df.groupby('Category').cumcount()
df['Cumulative_Count'] = grouped
print("\n添加 'Cumulative_Count' 列后的 DataFrame:\n", df)
# 输出：
# 添加 'Cumulative_Count' 列后的 DataFrame:
#   Category  Value  Cumulative_Count
# 0        A     10         0
# 1        A     20         1
# 2        B     30         0
# 3        B     40         1
# 4        C     50         0
# 5        C     60         1
```

- 变换函数 `transform()` 函数 自定义变换时使用

- 组索引与过滤 `filter()` 函数

- 对分组进行筛选。如果一个分组的全体行统计结果返回 `True`，则保留该分组，否则过滤。未被过滤的组及其对应行拼接为新的 `DataFrame` 返回

```python
gb = df.groupby('a')['b'].transform(['sum', 'mean'])
gb = df.groupby('a')['b'].filter('sum')
```

- `apply()函数`

```python
gb = df.groupby['a']('b').apply(func)

# 定义一个函数来计算成绩分布
def grade_distribution(group):
    return pd.Series({
        'Count': group.shape[0],
        'Math_Max': group['Math_Score'].max(),
        'Math_Min': group['Math_Score'].min(),
        'English_Max': group['English_Score'].max(),
        'English_Min': group['English_Score'].min()
    })

# 按 'School' 分组并应用自定义函数
distribution = df.groupby('School').apply(grade_distribution)
print("\n每个学校的成绩分布:\n", distribution)

'''
每个学校的成绩分布:
         Count  Math_Max  Math_Min  English_Max  English_Min
School                                                        
A            2        90        85            85            80
B            2        92        78            89            75
C            3        95        76            94            70
'''
```