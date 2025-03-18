---
title: 【機器學習2021】Hung-Yi Lee
date: 2025-03-18 17:00:00 +0800
categories: [LLM/MLLM, Hung-Yi Lee]
tags: [llm/mllm, hung-yi lee]     # TAG names should always be lowercase
description: 【機器學習2021】Hung-Yi Lee
---

# 自注意力机制（上）

- [课程链接](https://www.youtube.com/watch?v=hYdO9CscNes)

- Vector set as input

## 表示办法

### 独热编码 one-hot Encoding

- 缺点：缺失了语义信息

```python
apple = [1, 0, 0, 0 ...]
banana = [0, 1, 0, 0 ...]
cat = [0, 0, 1, 0 ...]
dog = [0, 0, 0, 1 ...]
```

### 词嵌入 Word Embedding

- 具有相似语义信息的词汇在坐标系上更接近

## 输入

- 将每个词提取出来，当作一个 vector，这个 vector 也被称之为 frame

- 图实际上也可以当作 vector set。以社交网络图为例，若每个人是一个结点，令每个结点为一个向量，那么该向量就存储了每个人的个人信息

- AI4sci 中还有分子领域，每个化学分子可以当作 vector set，使用 one-hot Encoding

```python
H = [1, 0, 0, 0 ...] # 氢
C = [0, 1, 0, 0 ...] # 碳
O = [0, 0, 1, 0 ...] # 氧
......
```

## 输出

### 各类任务概述

- 如果每个向量都有一个标签，那么模型就是输出标签，输入输出长度相同（如输入四个向量，输出四个标签），可化为 classification 或 regression 问题

    - 例：POS tagging 词性标注

    - 例：给定社交网络图，决定某个人的特性（例如是否购买某产品）

- 如果整个输入序列有一个标签，则输入长度不限的序列，输出为一个标签

    - 例：Sentiment analysis 语句情感分析

    - 例：某分子特性分析

- 模型自行决定输出多少模型 seq2seq

    - 例：Translation

### Self-attention 机制

- 第一种任务也称之为 Sequence Labeling

- 一个直觉的办法是，让每一个词汇都与一个全连接层相连，使得一个词汇对应一个词性

    - 第一个问题：对于多义词怎么办？

    - 解决：不妨开一个 window，使得其涵盖上下文信息，让全连接层可以参考上下文

    - 第二个问题：window 长度怎么设定？过大 window 也显然会造成计算开销巨大

    - 解决：引入 Self-attention 机制

- Self-attention 运作机制

    - [Attention is all you need](https://arxiv.org/abs/1706.03762)

    1. 计算两个向量之间是否相关，使用 Dot-product（对应元素相乘后累加），query 向量与 key 向量相乘，得到 attention score
    2. 经过 soft-max 层（没有什么道理，换成 ReLU 或者 activation function 都可以）
    3. 基于 attention score 抽取出关键信息，为 attention score 乘上一个矩阵
    4. 各关键信息累加，得到输出结果

    ![得到 attention score](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_01.png)

    ![基于 attention score 得到关键信息](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_02.png)

    ![模型总览](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_03.png)

    ![Self-attention](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_04.png)


# 自注意力机制（下）

- [课程链接](https://www.youtube.com/watch?v=gmsMY5kc-zw)

## 自注意力机制 - 线性代数视角

- 不妨使用线性代数去看待 self-attention

- **实际上，需要学习的参数，只有三个矩阵**

- ![计算得到 attention score 矩阵](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_05.png)

- ![计算得到 output 矩阵](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_06.png)

- ![概览与实际需要学习的参数](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_07.png)

### Multi-head Self-attention 多头注意力机制

- 多头注意力机制就是设计 N 个矩阵，不同的矩阵负责不同种类的相关性，最后拼接起来

- ![多头注意力机制](assets/post_img/2025-03-18-ML_HungYi_Lee/2025-03-18-ML_HungYi_Lee_08.png)

## Positional Encoding 位置编码

- 我们发现，自注意力机制中缺失了位置信息。如果对你的任务而言，位置信息很重要，我们可以做到将位置信息编码进去

- 不妨，给每一个位置设置一个专属的位置编码 e^i

- 可以 hand-crafted，也可以参考 [如何更好地设定 positional encoding](https://arxiv.org/abs/2003.09229)：整个问题尚待研究，不必纠结

## 应用

- [Attention is all you need](https://arxiv.org/abs/1706.03762)

- [BERT](https://arxiv.org/abs/1810.04805)

- [语音识别](https://arxiv.org/abs/1910.12977)：语音信息过长，最终的注意力矩阵也会很大，时间空间内存消耗巨大，故引入 Truncated Self-attention，我们只用看一个小范围就能判断了

- [图像识别 self-attention GAN](https://arxiv.org/abs/1805.08318)

- [图像识别 DEtection Transformer DETR](https://arxiv.org/abs/2005.12872)

- self-attention for graph - GNN 的一种：每个结点只用关注相连的结点即可，参考邻接矩阵

## self-attention v.s. CNN

- CNN 可以看作是一种简化版的 self-attention，因为它只关注一小部分范围的图像

- self-attention 则关注全部图像

- [研究 self-attention 与 CNN 之间的关系](https://arxiv.org/abs/1911.03584)

- self-attention 更加 flexible，需要更大的数据量，否则容易过过拟合；CNN 则相反

- [不同数据量下 self-attention 与 CNN 的性能比较](https://arxiv.org/abs/2010.11929)

## self-attention v.s. RNN

- RNN 中，后面一个 vector 为了做到考虑前面的 vector，必须把前面的 vector 存到 memory 中

- RNN 做不到平行化产生数据，必须一个一个地处理

- [self-attention 与 RNN 关系](https://arxiv.org/abs/2006.16236)

## 其它

- [研究高效 transformer 的 benchmark](https://arxiv.org/abs/2011.04006)

- [高效 transformer 综述](https://arxiv.org/abs/2009.06732)

# Transformer (上)