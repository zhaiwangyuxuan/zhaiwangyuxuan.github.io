---
title: 【算法刷题】蓝桥杯相关反思总结
date: 2024-10-23 00:10:00 +0800
categories: [algorithm, LanQiaoBei]
tags: [algorithm competition]     # TAG names should always be lowercase
description: 【算法刷题】蓝桥杯相关反思总结
---

## 多造特殊样例进行测试，蓝桥杯一锤定音，水题绝对不能出错！

## 随手开`long long`，要不然就用`1ll`

```cpp
// 过了
ll qmi(ll a, ll b, ll MOD);

// 没过 看哭了
int qmi(int a, int b, int MOD);
```

## 负数取模转换

```cpp
// C++ 中，-5 % 3 = -2
// 但在数学推理中，余数必须是正数
// 即 -5 % 3 = 1

// 有以下转换
int a = (-b + mod) % mod;
// 即可获得数学意义上的模数
```

## 四舍五入

- [acwing上的链接](https://www.acwing.com/problem/content/2869/)

该题要求“第三行包含一个实数，四舍五入保留正好两位小数”

有两种办法

```cpp
// 经典
printf("%.2lf", sum / (double)n)

// 要多记一点的
cout << fixed << setprecision(2) << sum / (double)n;
```

- 需要头文件`#include <iomanip>`
- `setprecision()`来用来保存有效数字，`fixed`和`setprecision()`一起用就变成保存小数点后有效数字。 
- `fixed`有个地方需要注意的是可以保存的有效数字包括0，不开`fixed`的话，即使保存3个有效数字，小数点后的0也会自动省略。

## 打表 + 细心题

- [acwing链接](https://www.acwing.com/problem/content/description/2870/)

*无需多言*

## `STL`常忘操作

- [codeforces CF982 Div.2 C](https://codeforces.com/contest/2027/problem/C)

```cpp
cout << *myset.rbegin() << endl;
// 输出set中最后一个元素 也就是最大的值
// myset.rbegin() 返回的是指向最后一个元素的迭代器，而非数值
// 慎用 unordered_map
```

## 图论最短路

- Floyd - 允许有负权边 - O(n^3) - 动态规划
- Bellman-Ford - 允许有负权边 - 单源最短路问题 - O(nm)
- SPFA - 不稳定！慎用！
- Dijkstra - 不允许有负权边 - 单源最短路问题 - O(mlogn)（优化后的） - 贪心

如果一个题目的规模很大，并且边的权值为非负数，则它很可能故意设置了不利于`SPFA`的测试数据，此时应该考虑`Dijkstra`算法。`Dijkstra`算法是一种稳定的算法，一次迭代至少能找到一个结点到s的最短路径，最多只需要m(边数)次迭代就可完成。