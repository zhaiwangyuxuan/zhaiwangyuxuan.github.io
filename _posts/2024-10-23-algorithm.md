---
title: 【算法刷题】相关反思总结
date: 2024-10-23 00:10:00 +0800
categories: [algorithm, LanQiaoBei]
tags: [algorithm competition]     # TAG names should always be lowercase
description: 【算法刷题】相关反思总结
---

## 蓝桥杯要多造特殊样例进行测试，水题绝对不能出错！
## CSP则多关注大模拟！模拟近期要多练！

------

## 模拟题积累

### 处理字符串特别好用的 `stringstream` 类
- `stringstream`是C++提供的专门用于处理字符串的输入输出**流类**，也就是说，这个跟`cin`与`cout`是一类呦！
```cpp
// 创建对象
stringstream ss;

//也可以初始化
string str;
stringstream ss(str);

// 或者这么输入
ss << str;

// 输出对象内的字符串内容
cout << ss.str(); // cout << ss; 会报错

// 可以直接利用 .str() 来修改或清空
ss.str("hello world!")
ss.str("")

// 由于 stringstream 自动按照空格分 所以可以来点花活
string str;
getline(cin, str); // 模拟题中用来读取整行

stringstream mysin(str); 
vector<string> input;

while(mysin >> str) input.push_back(str); // 自动就按照空格分啦！

// 使用这种办法 还可以自动按照逗号分哟(^ U ^)ノ~YO
// geiline() 第三个参数默认是 \n 这里换成了 逗号    
while (getline(ss, str, ',')) input.push_back(str);
```

### string 与 long long int 速转函数

```cpp
// 转化为字符串
to_string(num);

// 接收三个参数
// 第一个参数是要转换的字符串
// 第二个参数不用了解 无脑空指针
// 第三个参数是转换后的数字是几进制
stoll(str, nullptr, 10);
```

------------------------------

## 数论积累

### 两个数字凑不出的最大数字
- [蓝桥杯例题-买不到的数目](https://www.acwing.com/problem/content/1207/)
- 引理：给定`a`、`b`，若 `d = gcd(a, b) > 1`，则两个数一定不能凑出最大数
- **结论**；如果`a`，`b`是正整数并且互质，那么由`ax + by, x >= 0, y >= 0`不能凑出的最大数字是`ab - a - b`
- [yxc讲解](https://www.acwing.com/solution/acwing/content/3165/) 

### 负数取模转换

```cpp
// C++ 中，-5 % 3 = -2
// 但在数学推理中，余数必须是正数
// 即 -5 % 3 = 1

// 有以下转换
int a = (-b + mod) % mod;
// 即可获得数学意义上的模数
```

------------------------------

## 图论

### 图论最短路

- Floyd - 允许有负权边 - O(n^3) - 动态规划
- Bellman-Ford - 允许有负权边 - 单源最短路问题 - O(nm)
- SPFA - 不稳定！慎用！
- Dijkstra - 不允许有负权边 - 单源最短路问题 - O(mlogn)（优化后的） - 贪心

如果一个题目的规模很大，并且边的权值为非负数，则它很可能故意设置了不利于`SPFA`的测试数据，此时应该考虑`Dijkstra`算法。`Dijkstra`算法是一种稳定的算法，一次迭代至少能找到一个结点到s的最短路径，最多只需要m(边数)次迭代就可完成。

------------------------------

## 杂项

### 四舍五入

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

### `STL`常忘操作

- [codeforces CF982 Div.2 C](https://codeforces.com/contest/2027/problem/C)

```cpp
cout << *myset.rbegin() << endl;
// 输出set中最后一个元素 也就是最大的值
// myset.rbegin() 返回的是指向最后一个元素的迭代器，而非数值
// 慎用 unordered_map
```

### 随手开`long long`，要不然就用`1ll`

```cpp
// 过了
ll qmi(ll a, ll b, ll MOD);

// 没过 看哭了
int qmi(int a, int b, int MOD);
```


-------------

## 刷题量记录（不记录过水的题）
- 以2024.11.01 以300题为起始点计数
- 2024.11.02 两道题
- 2024.11.03 赶DDL没刷题
- 2024.11.04 一道题 模拟题哎模拟
- 2024.11.05 一道比昨天难的模拟 哎模拟哎模拟
- 2024.11.06 沉迷科研没做题
- 2024.11.07 做了第十届北交新生赛的两道题 都是比较简单的题