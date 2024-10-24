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