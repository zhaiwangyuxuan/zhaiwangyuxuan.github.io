---
title: 【AI程设】Python 基础
date: 2024-12-19 10:00:00 +0800
categories: [BJTU, AI_programming]
tags: [python]     # TAG names should always be lowercase
description: AI程设课上教的 Python 基础
---

> 内容来源于 北京交通大学 计算机学院 人工智能专业 大二专业课 人工智能程序设计

# `Python` 基础

## 推导式

- 列表推导式：`[表达式 for 变量 in 列表] / [... for ... in ... if ...]`

- 字典推导式：`{key : value for ... in ... if ...}`

- 复杂双选模式：`[... if ... else ... for ... in ...]`

```python
color=['red', 'blue']
item=['book', 'pen']
list1=[(c, i) for c in color for i in item]
list2=[[(c, i) for c in color] for i in item]

# [('red', 'book'), ('red', 'pen'), ('blue', 'book'), ('blue', 'pen')]
# [[('red', 'book'), ('blue', 'book')], [('red', 'pen'), ('blue', 'pen')]]

l = ['apple', 'banana', 'orange', 'peach', 'watermelon']
l2 = {word : len(word) for word in l}

# {'apple': 5, 'banana': 6, 'orange': 6, 'peach': 5, 'watermelon': 10}
```

## 常用函数

-  `str.upper()` `str.lower()` `str.title()` 全大写 全小写 仅首字母大写

- `filter(func, iterable)` 函数

- `lambda ... : ...` 匿名函数

```python
my_list =[[1, 2], [3, 4, 5], [6], [7, 8], [9]]
list(filter(lambda x: sum(x) > 5, my_list))
# [[3, 4, 5], [6], [7, 8], [9]]

list(filter(lambda x: sum(i if i % 2 == 1 else 0 for i in x) > 5, my_list))
# [[3, 4, 5], [7, 8], [9]]
```

- `any()` `all()` 任一满足 全部满足 返回布尔值

- `zip()` 打包函数，对两个列表中对应位置上的元素进行同时操作

-  `enumerate()` 绑定(序号, 元素)

```python
l1 = ['01', '02', '03', '04']
l2 = ['张三', '李四', '王五', '赵六']
d = dict(zip(l1, l2))
# {'01': '张三', '02': '李四', '03': '王五', '04': '赵六'}

l = list(zip(l1, l2))
# [('01', '张三'), ('02', '李四'), ('03', '王五'), ('04', '赵六')]

res = list(zip(*l))
# [('01', '02', '03', '04'), ('张三', '李四', '王五', '赵六')]
```

```python
l2 = ['张三', '李四', '王五', '赵六']
for idx, value in enumerate(l2):
    print(idx, value)

for i, v in zip(range(len(l2)), l2):
    print(i, v)

# 0 张三
# 1 李四
# 2 王五
# 3 赵六
```