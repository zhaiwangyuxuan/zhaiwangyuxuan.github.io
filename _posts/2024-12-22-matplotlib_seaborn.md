---
title: 【AI程设】matplotlib 与 seaborn
date: 2024-12-22 10:00:00 +0800
categories: [BJTU, matplotlib]
tags: [python]     # TAG names should always be lowercase
description: AI程设课上教的 matplotlib 与 seaborn
---

> 内容来源于 北京交通大学 计算机学院 人工智能专业 大二专业课 人工智能程序设计

## `matplotlib` 基础

![图一](assets/post_img/2024-12-22-matplotlib_seaborn/2024-12-22-matplotlib_seaborn_01.png)

### 设置中文

```python
plt.rcParams['font.sans-serif'] = 'SimHei' ## 设置中文显示
plt.rcParams['axes.unicode_minus'] = False
```

### 基本参数

- `p1 = plt.figure(figsize = (n, m))` 创建一张画布

- `ax = p1.add_subplot(a, b, cnt)` 注意，在这张画布上的画图的话，之后所有的 `a` 与 `b` 都要相同。相当于把画布分成了 `a * b` 份

- `plt.title('...')` 添加标题

- `plt.xlim((c, d))` `plt.tlim((c, d))` x 与 y 的范围

- `plt.xticks(ticks = [...], labels = [...])` `plt.yticks([x, y, z])` 确定两轴刻度与对应标签

- `plt.xlabel('...')` `plt.tlabel('...')` 确定两轴名称

- `plt.plot(data_x, data_y)` 在两轴上绘制图形

- `plt.legend(['...', '...', ...])` 自动确定图例

- `plt.show()` 展示绘制好的图形

```python
import matplotlib.pyplot as plt
import numpy as np

# 最简单的画图可以省略这一部分
p1 = plt.figure(figsize = (10, 10))

# 第一个子图
ax1 = p1.add_subplot(2, 2, 1)

# 添加图例一定要在绘制图形之后
data = np.arange(0, 1.1, 0.01)
plt.title('lines') ## 添加标题
plt.xlabel('x')## 添加x轴的名称
plt.ylabel('y')## 添加y轴的名称
plt.xlim((0, 1))## 确定x轴范围
plt.ylim((0, 1))## 确定y轴范围
plt.xticks([0, 0.2, 0.4, 0.6, 0.8, 1])## 规定x轴刻度
plt.yticks([0, 0.2, 0.4, 0.6, 0.8, 1])## 确定y轴刻度
plt.plot(data, data ** 2)## 添加y=x^2曲线
plt.plot(data, data ** 4)## 添加y=x^4曲线
plt.legend(['y = x^2','y = x^4']) # 指定当前图形的图例

# 第二个子图
ax2 = p1.add_subplot(2, 2, 2)

data2 = np.arange(0, 100, 0.01)
plt.title("test 02")
plt.xlabel("x2")
plt.ylabel("y2")
plt.xlim((0, 100))
plt.ylim((0, 100))
plt.xticks([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
plt.yticks([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
plt.plot(data2, data2)
plt.plot(data2, data2 ** 3)
plt.legend(['y = x', 'y = x^3'])
```

![图二](assets/post_img/2024-12-22-matplotlib_seaborn/2024-12-22-matplotlib_seaborn_02.png)

### 散点图

- 反应特征间的统计关系，通常用于跨类别的数据

- `plt.scatter(x, y, ...)`

### 折线图

- 查看变量间的改变趋势

- `plt.plot(x, y, ...)`

```python
plt.plot(values[:, 0], values[:, 2], color = 'r', linestyle = '--', marker = 'o') # 绘制点线图
```

![图三](assets/post_img/2024-12-22-matplotlib_seaborn/2024-12-22-matplotlib_seaborn_03.png)

### 直方图

- `plt.bar(x, y, width = ..., color = ..., ...)`

### 饼图

- `plt.pie(x, explode = None, labels = None, colors = None, autopct = None, ...)`

- `explode = [...]` 接收 `array` 表示指定项离饼图圆心为 `n` 个半径。

```python
plt.figure(figsize = (6, 6)) # 将画布设定为正方形，则绘制的饼图是正圆
label = ['第一产业', '第二产业', '第三产业'] # 定义饼状图的标签，标签是列表
explode = [0.01, 0.01, 0.01] # 设定各项离心n个半径
plt.pie(values[-1, 3:6], explode = explode, labels = label, autopct = '%1.1f%%') # 绘制饼图
plt.title('2017年第一季度各产业国民生产总值饼图')
plt.savefig('2017年第一季度各产业生产总值占比饼图')
plt.show()
```

![图四](assets/post_img/2024-12-22-matplotlib_seaborn/2024-12-22-matplotlib_seaborn_04.png)

### 箱线图

- 箱线图利用数据中的五个统计量（最小值、下四分位数、中位数、上四分位数和最大值）

- `plt.boxplot(x, notch = True, labels = label, meanline = True, ...)`

- `notch = ...` 中间箱体是否有缺口

- `labels = [...]` 指定每一个箱线图的标签

- `meanline = ...` 表示是否显示均值线

```python
label = ['第一产业', '第二产业', '第三产业']## 定义标签
gdp = (list(values[:,3]), list(values[:,4]), list(values[:,5]))
plt.figure(figsize = (6, 4))
plt.boxplot(gdp, notch = True, labels = label, meanline = True)
plt.title('2000-2017各产业国民生产总值箱线图')
plt.show()
```

![图五](assets/post_img/2024-12-22-matplotlib_seaborn/2024-12-22-matplotlib_seaborn_05.png)

## `seaborn` 基础

```python
import seaborn as sns

sns.set_theme(font = 'SimHei')
```

### 直方图与核密度曲线

- `sns.histplot(data, ax = ..., kde = ...)`

- `ax = ...` 是第几张图

- `kde = boolean` 是否绘制核密度曲线 

```python
for idx, col in enumerate(numeric_cols):
    ax = p4.add_subplot(3, 4, idx+1)
    sns.histplot(data[col], ax=ax, kde=True)
```

![图六](assets/post_img/2024-12-22-matplotlib_seaborn/2024-12-22-matplotlib_seaborn_06.png)

### 变量间相关分析

- `DataFrame` 自带 `.corr()` 来计算相关系数

```python
corr = data[numeric_cols].corr()
```

- 使用热力图来查看相关系数

- `plt.heatmap(data, annot = ..., cmap = 'coolwarm', fmt = ',2f')`

- `annot = boolean` 是否在热力图中的每个格内显示数值

- `cmap = '...'` 指定颜色风格

- `fmt = ...` 数值风格，小数...

```python
# 绘制相关系数图
p6 = plt.figure(figsize = (8, 6), dpi = 120)
sns.heatmap(corr, annot = True, cmap = 'coolwarm', fmt = '.2f', linewidths = 0.5)   
```

![图七](assets/post_img/2024-12-22-matplotlib_seaborn/2024-12-22-matplotlib_seaborn_07.png)